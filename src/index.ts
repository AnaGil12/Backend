import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

// Cargar variables de entorno
dotenv.config();

// Importar tus servicios, repositorios y rutas
import { Logger } from './infrastructure/services/Logger';
import { createAuthRoutes } from './presentation/routes/authRoutes';
import { createChallengeRoutes } from './presentation/routes/challengeRoutes';
import { createSubmissionRoutes } from './presentation/routes/submissionRoutes';
import { ErrorHandler } from './presentation/middleware/errorHandler';
import { AuthMiddleware } from './presentation/middleware/auth';
import { AuthService } from './infrastructure/services/AuthService';
import { JobQueueService } from './infrastructure/services/JobQueueService';
import { RunnerService } from './infrastructure/services/RunnerService';
import { AIAssistantService } from './infrastructure/services/AIAssistantService';
import { MongoUserRepository } from './infrastructure/repositories/MongoUserRepository';
import { MongoChallengeRepository } from './infrastructure/repositories/MongoChallengeRepository';
import { MockCourseRepository } from './infrastructure/repositories/MockCourseRepository';
import { MockSubmissionRepository } from './infrastructure/repositories/MockSubmissionRepository';
import { MockLeaderboardRepository } from './infrastructure/repositories/MockLeaderboardRepository';
import { LoginUseCase } from './application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from './application/use-cases/auth/RegisterUseCase';
import { CreateChallengeUseCase } from './application/use-cases/challenges/CreateChallengeUseCase';
import { SubmitSolutionUseCase } from './application/use-cases/submissions/SubmitSolutionUseCase';
import { AuthController } from './presentation/controllers/AuthController';
import { ChallengeController } from './presentation/controllers/ChallengeController';
import { SubmissionController } from './presentation/controllers/SubmissionController';

const app = express();
const logger = new Logger('Application');

// 🧱 Middleware base
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 📈 Rate limit y logs
app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: { success: false, message: 'Too many requests, try again later.' }
}));
app.use(morgan('combined', {
  stream: { write: (msg: string) => logger.info(msg.trim()) }
}));

// 🧩 Instanciar dependencias
const authService = new AuthService();
const jobQueueService = new JobQueueService();
const runnerService = new RunnerService();
const aiAssistantService = new AIAssistantService();

const userRepo = new MongoUserRepository();
const challengeRepo = new MongoChallengeRepository();
const courseRepo = new MockCourseRepository();
const submissionRepo = new MockSubmissionRepository();
const leaderboardRepo = new MockLeaderboardRepository();

const loginUC = new LoginUseCase(userRepo, authService);
const registerUC = new RegisterUseCase(userRepo, authService);
const createChallengeUC = new CreateChallengeUseCase(challengeRepo, courseRepo);
const submitSolutionUC = new SubmitSolutionUseCase(submissionRepo, challengeRepo, courseRepo, jobQueueService);

const authController = new AuthController(loginUC, registerUC, authService);
const challengeController = new ChallengeController(createChallengeUC, challengeRepo);
const submissionController = new SubmissionController(submitSolutionUC, submissionRepo);

const authMiddleware = new AuthMiddleware(authService);

// ✅ Endpoints base
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 🚀 Montar rutas principales
app.use('/api/auth', createAuthRoutes(authController));
app.use('/api/challenges', createChallengeRoutes(challengeController, authMiddleware));
app.use('/api/submissions', createSubmissionRoutes(submissionController, authMiddleware));

// 📊 Endpoint de métricas (mock)
app.get('/api/metrics', (req, res) => {
  res.json({
    success: true,
    data: {
      submissions_total: 0,
      submissions_failed_total: 0,
      average_execution_time_ms: 0,
      active_runners: 0
    }
  });
});

// 📘 Swagger Docs
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Algorithmic Challenges API',
      version: '1.0.0',
      description: 'Documentación interactiva de la API para la plataforma de retos algorítmicos',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
  },
  apis: ['./src/presentation/routes/*.ts'], // ⚠️ Ajusta si tus rutas están en otra carpeta
};
const swaggerSpecs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// ⚠️ Manejo de errores
app.use(ErrorHandler.notFound);
app.use(ErrorHandler.handle);

// 🔌 Conexión a Mongo y arranque
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/algorithmic-challenges';

mongoose.connect(DATABASE_URL)
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Swagger disponible en http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    logger.error('Error connecting to MongoDB', err);
    process.exit(1);
  });

export default app;
