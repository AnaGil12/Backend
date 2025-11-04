"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const AuthService_1 = require("./infrastructure/services/AuthService");
const JobQueueService_1 = require("./infrastructure/services/JobQueueService");
const RunnerService_1 = require("./infrastructure/services/RunnerService");
const AIAssistantService_1 = require("./infrastructure/services/AIAssistantService");
const Logger_1 = require("./infrastructure/services/Logger");
const MongoUserRepository_1 = require("./infrastructure/repositories/MongoUserRepository");
const MongoChallengeRepository_1 = require("./infrastructure/repositories/MongoChallengeRepository");
const MockCourseRepository_1 = require("./infrastructure/repositories/MockCourseRepository");
const MockSubmissionRepository_1 = require("./infrastructure/repositories/MockSubmissionRepository");
const MockLeaderboardRepository_1 = require("./infrastructure/repositories/MockLeaderboardRepository");
const LoginUseCase_1 = require("./application/use-cases/auth/LoginUseCase");
const RegisterUseCase_1 = require("./application/use-cases/auth/RegisterUseCase");
const CreateChallengeUseCase_1 = require("./application/use-cases/challenges/CreateChallengeUseCase");
const SubmitSolutionUseCase_1 = require("./application/use-cases/submissions/SubmitSolutionUseCase");
const AuthController_1 = require("./presentation/controllers/AuthController");
const ChallengeController_1 = require("./presentation/controllers/ChallengeController");
const SubmissionController_1 = require("./presentation/controllers/SubmissionController");
const auth_1 = require("./presentation/middleware/auth");
const errorHandler_1 = require("./presentation/middleware/errorHandler");
const authRoutes_1 = require("./presentation/routes/authRoutes");
const challengeRoutes_1 = require("./presentation/routes/challengeRoutes");
const submissionRoutes_1 = require("./presentation/routes/submissionRoutes");
class Application {
    constructor() {
        this.app = (0, express_1.default)();
        this.logger = new Logger_1.Logger('Application');
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN || '*',
            credentials: true
        }));
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
            message: {
                success: false,
                message: 'Too many requests from this IP, please try again later.'
            }
        });
        this.app.use(limiter);
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, morgan_1.default)('combined', {
            stream: {
                write: (message) => {
                    this.logger.info(message.trim());
                }
            }
        }));
    }
    setupRoutes() {
        const authService = new AuthService_1.AuthService();
        const jobQueueService = new JobQueueService_1.JobQueueService();
        const runnerService = new RunnerService_1.RunnerService();
        const aiAssistantService = new AIAssistantService_1.AIAssistantService();
        const userRepository = new MongoUserRepository_1.MongoUserRepository();
        const challengeRepository = new MongoChallengeRepository_1.MongoChallengeRepository();
        const courseRepository = new MockCourseRepository_1.MockCourseRepository();
        const submissionRepository = new MockSubmissionRepository_1.MockSubmissionRepository();
        const leaderboardRepository = new MockLeaderboardRepository_1.MockLeaderboardRepository();
        const loginUseCase = new LoginUseCase_1.LoginUseCase(userRepository, authService);
        const registerUseCase = new RegisterUseCase_1.RegisterUseCase(userRepository, authService);
        const createChallengeUseCase = new CreateChallengeUseCase_1.CreateChallengeUseCase(challengeRepository, courseRepository);
        const submitSolutionUseCase = new SubmitSolutionUseCase_1.SubmitSolutionUseCase(submissionRepository, challengeRepository, courseRepository, jobQueueService);
        const authController = new AuthController_1.AuthController(loginUseCase, registerUseCase, authService);
        const challengeController = new ChallengeController_1.ChallengeController(createChallengeUseCase, challengeRepository);
        const submissionController = new SubmissionController_1.SubmissionController(submitSolutionUseCase, submissionRepository);
        const authMiddleware = new auth_1.AuthMiddleware(authService);
        this.app.get('/health', (req, res) => {
            res.json({
                success: true,
                message: 'API is running',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });
        this.app.use('/api/auth', (0, authRoutes_1.createAuthRoutes)(authController));
        this.app.use('/api/challenges', (0, challengeRoutes_1.createChallengeRoutes)(challengeController, authMiddleware));
        this.app.use('/api/submissions', (0, submissionRoutes_1.createSubmissionRoutes)(submissionController, authMiddleware));
        this.app.get('/api/metrics', (req, res) => {
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
    }
    setupErrorHandling() {
        this.app.use(errorHandler_1.ErrorHandler.notFound);
        this.app.use(errorHandler_1.ErrorHandler.handle);
    }
    async start() {
        try {
            const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/algorithmic-challenges';
            await mongoose_1.default.connect(mongoUrl);
            this.logger.info('Connected to MongoDB');
            const port = process.env.PORT || 3000;
            this.app.listen(port, () => {
                this.logger.info(`Server running on port ${port}`);
                this.logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            });
        }
        catch (error) {
            this.logger.error('Failed to start application:', error);
            if (process.env.NODE_ENV !== 'test') {
                process.exit(1);
            }
            throw error;
        }
    }
    getApp() {
        return this.app;
    }
}
const app = new Application();
if (process.env.NODE_ENV !== 'test') {
    app.start().catch((error) => {
        console.error('Failed to start application:', error);
        process.exit(1);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map