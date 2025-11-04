import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import services and repositories
import { AuthService } from './infrastructure/services/AuthService';
import { JobQueueService } from './infrastructure/services/JobQueueService';
import { RunnerService } from './infrastructure/services/RunnerService';
import { AIAssistantService } from './infrastructure/services/AIAssistantService';
import { Logger } from './infrastructure/services/Logger';

import { MongoUserRepository } from './infrastructure/repositories/MongoUserRepository';
import { MongoChallengeRepository } from './infrastructure/repositories/MongoChallengeRepository';
import { MockCourseRepository } from './infrastructure/repositories/MockCourseRepository';
import { MockSubmissionRepository } from './infrastructure/repositories/MockSubmissionRepository';
import { MockLeaderboardRepository } from './infrastructure/repositories/MockLeaderboardRepository';

// Import use cases
import { LoginUseCase } from './application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from './application/use-cases/auth/RegisterUseCase';
import { CreateChallengeUseCase } from './application/use-cases/challenges/CreateChallengeUseCase';
import { SubmitSolutionUseCase } from './application/use-cases/submissions/SubmitSolutionUseCase';

// Import controllers
import { AuthController } from './presentation/controllers/AuthController';
import { ChallengeController } from './presentation/controllers/ChallengeController';
import { SubmissionController } from './presentation/controllers/SubmissionController';

// Import middleware
import { AuthMiddleware } from './presentation/middleware/auth';
import { ErrorHandler } from './presentation/middleware/errorHandler';

// Import routes
import { createAuthRoutes } from './presentation/routes/authRoutes';
import { createChallengeRoutes } from './presentation/routes/challengeRoutes';
import { createSubmissionRoutes } from './presentation/routes/submissionRoutes';

class Application {
  private app: express.Application;
  private logger: Logger;

  constructor() {
    this.app = express();
    this.logger = new Logger('Application');
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
      }
    });
    this.app.use(limiter);

    // Compression and parsing
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    this.app.use(morgan('combined', {
      stream: {
        write: (message: string) => {
          this.logger.info(message.trim());
        }
      }
    }));
  }

  private setupRoutes(): void {
    // Initialize services
    const authService = new AuthService();
    const jobQueueService = new JobQueueService();
    const runnerService = new RunnerService();
    const aiAssistantService = new AIAssistantService();

    // Initialize repositories
    const userRepository = new MongoUserRepository();
    const challengeRepository = new MongoChallengeRepository();
    const courseRepository = new MockCourseRepository();
    const submissionRepository = new MockSubmissionRepository();
    const leaderboardRepository = new MockLeaderboardRepository();

    // Initialize use cases
    const loginUseCase = new LoginUseCase(userRepository, authService);
    const registerUseCase = new RegisterUseCase(userRepository, authService);
    const createChallengeUseCase = new CreateChallengeUseCase(challengeRepository, courseRepository);
    const submitSolutionUseCase = new SubmitSolutionUseCase(
      submissionRepository,
      challengeRepository,
      courseRepository,
      jobQueueService
    );

    // Initialize controllers
    const authController = new AuthController(loginUseCase, registerUseCase, authService);
    const challengeController = new ChallengeController(createChallengeUseCase, challengeRepository);
    const submissionController = new SubmissionController(submitSolutionUseCase, submissionRepository);

    // Initialize middleware
    const authMiddleware = new AuthMiddleware(authService);

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // API routes
    this.app.use('/api/auth', createAuthRoutes(authController));
    this.app.use('/api/challenges', createChallengeRoutes(challengeController, authMiddleware));
    this.app.use('/api/submissions', createSubmissionRoutes(submissionController, authMiddleware));

    // Metrics endpoint
    this.app.get('/api/metrics', (req, res) => {
      res.json({
        success: true,
        data: {
          submissions_total: 0, // This would be implemented with actual metrics
          submissions_failed_total: 0,
          average_execution_time_ms: 0,
          active_runners: 0
        }
      });
    });
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use(ErrorHandler.notFound);

    // Global error handler
    this.app.use(ErrorHandler.handle);
  }

  public async start(): Promise<void> {
    try {
      // Connect to MongoDB
      const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/algorithmic-challenges';
      await mongoose.connect(mongoUrl);
      this.logger.info('Connected to MongoDB');

      // Start server
      const port = process.env.PORT || 3000;
      this.app.listen(port, () => {
        this.logger.info(`Server running on port ${port}`);
        this.logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });

    } catch (error) {
      this.logger.error('Failed to start application:', error);
      // Only exit in production, not during tests
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1);
      }
      throw error; // Re-throw for tests to handle
    }
  }

  public getApp(): express.Application {
    return this.app;
  }
}

// Start the application
const app = new Application();

// Only start automatically if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.start().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
  });
}

export default app;

