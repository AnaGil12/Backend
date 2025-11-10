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
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
// Cargar variables de entorno
dotenv_1.default.config();
// Importar tus servicios, repositorios y rutas
const Logger_1 = require("./infrastructure/services/Logger");
const authRoutes_1 = require("./presentation/routes/authRoutes");
const challengeRoutes_1 = require("./presentation/routes/challengeRoutes");
const submissionRoutes_1 = require("./presentation/routes/submissionRoutes");
const courseRoutes_1 = require("./presentation/routes/courseRoutes");
const evaluationRoutes_1 = require("./presentation/routes/evaluationRoutes");
const leaderboardRoutes_1 = require("./presentation/routes/leaderboardRoutes");
const aiAssistantRoutes_1 = require("./presentation/routes/aiAssistantRoutes");
const errorHandler_1 = require("./presentation/middleware/errorHandler");
const auth_1 = require("./presentation/middleware/auth");
const AuthService_1 = require("./infrastructure/services/AuthService");
const JobQueueService_1 = require("./infrastructure/services/JobQueueService");
const RunnerService_1 = require("./infrastructure/services/RunnerService");
const AIAssistantService_1 = require("./infrastructure/services/AIAssistantService");
const MongoUserRepository_1 = require("./infrastructure/repositories/MongoUserRepository");
const MongoChallengeRepository_1 = require("./infrastructure/repositories/MongoChallengeRepository");
const MockCourseRepository_1 = require("./infrastructure/repositories/MockCourseRepository");
const MockSubmissionRepository_1 = require("./infrastructure/repositories/MockSubmissionRepository");
const MockLeaderboardRepository_1 = require("./infrastructure/repositories/MockLeaderboardRepository");
const MockEvaluationRepository_1 = require("./infrastructure/repositories/MockEvaluationRepository");
const LoginUseCase_1 = require("./application/use-cases/auth/LoginUseCase");
const RegisterUseCase_1 = require("./application/use-cases/auth/RegisterUseCase");
const CreateChallengeUseCase_1 = require("./application/use-cases/challenges/CreateChallengeUseCase");
const SubmitSolutionUseCase_1 = require("./application/use-cases/submissions/SubmitSolutionUseCase");
const CreateCourseUseCase_1 = require("./application/use-cases/courses/CreateCourseUseCase");
const CreateEvaluationUseCase_1 = require("./application/use-cases/evaluations/CreateEvaluationUseCase");
const AuthController_1 = require("./presentation/controllers/AuthController");
const ChallengeController_1 = require("./presentation/controllers/ChallengeController");
const SubmissionController_1 = require("./presentation/controllers/SubmissionController");
const CourseController_1 = require("./presentation/controllers/CourseController");
const EvaluationController_1 = require("./presentation/controllers/EvaluationController");
const LeaderboardController_1 = require("./presentation/controllers/LeaderboardController");
const AIAssistantController_1 = require("./presentation/controllers/AIAssistantController");
const app = (0, express_1.default)();
const logger = new Logger_1.Logger('Application');
// 🧱 Middleware base
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// 📈 Rate limit y logs
app.use((0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: { success: false, message: 'Too many requests, try again later.' }
}));
app.use((0, morgan_1.default)('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) }
}));
// 🧩 Instanciar dependencias
const authService = new AuthService_1.AuthService();
const jobQueueService = new JobQueueService_1.JobQueueService();
const runnerService = new RunnerService_1.RunnerService();
const aiAssistantService = new AIAssistantService_1.AIAssistantService();
const userRepo = new MongoUserRepository_1.MongoUserRepository();
const challengeRepo = new MongoChallengeRepository_1.MongoChallengeRepository();
const courseRepo = new MockCourseRepository_1.MockCourseRepository();
const submissionRepo = new MockSubmissionRepository_1.MockSubmissionRepository();
const leaderboardRepo = new MockLeaderboardRepository_1.MockLeaderboardRepository();
const evaluationRepo = new MockEvaluationRepository_1.MockEvaluationRepository();
const loginUC = new LoginUseCase_1.LoginUseCase(userRepo, authService);
const registerUC = new RegisterUseCase_1.RegisterUseCase(userRepo, authService);
const createChallengeUC = new CreateChallengeUseCase_1.CreateChallengeUseCase(challengeRepo, courseRepo);
const submitSolutionUC = new SubmitSolutionUseCase_1.SubmitSolutionUseCase(submissionRepo, challengeRepo, courseRepo, jobQueueService);
const createCourseUC = new CreateCourseUseCase_1.CreateCourseUseCase(courseRepo);
const createEvaluationUC = new CreateEvaluationUseCase_1.CreateEvaluationUseCase(evaluationRepo, courseRepo);
const authController = new AuthController_1.AuthController(loginUC, registerUC, authService);
const challengeController = new ChallengeController_1.ChallengeController(createChallengeUC, challengeRepo);
const submissionController = new SubmissionController_1.SubmissionController(submitSolutionUC, submissionRepo);
const courseController = new CourseController_1.CourseController(createCourseUC, courseRepo);
const evaluationController = new EvaluationController_1.EvaluationController(createEvaluationUC, evaluationRepo);
const leaderboardController = new LeaderboardController_1.LeaderboardController(leaderboardRepo);
const aiAssistantController = new AIAssistantController_1.AIAssistantController(aiAssistantService);
const authMiddleware = new auth_1.AuthMiddleware(authService);
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
app.use('/api/auth', (0, authRoutes_1.createAuthRoutes)(authController));
app.use('/api/challenges', (0, challengeRoutes_1.createChallengeRoutes)(challengeController, authMiddleware));
app.use('/api/submissions', (0, submissionRoutes_1.createSubmissionRoutes)(submissionController, authMiddleware));
app.use('/api/courses', (0, courseRoutes_1.createCourseRoutes)(courseController, authMiddleware));
app.use('/api/evaluations', (0, evaluationRoutes_1.createEvaluationRoutes)(evaluationController, authMiddleware));
app.use('/api/leaderboard', (0, leaderboardRoutes_1.createLeaderboardRoutes)(leaderboardController, authMiddleware));
app.use('/api/ai', (0, aiAssistantRoutes_1.createAIAssistantRoutes)(aiAssistantController, authMiddleware));
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
        tags: [
            { name: 'Authentication', description: 'Endpoints de autenticación' },
            { name: 'Challenges', description: 'Gestión de retos algorítmicos' },
            { name: 'Submissions', description: 'Envío y gestión de soluciones' },
            { name: 'Courses', description: 'Gestión de cursos' },
            { name: 'Evaluations', description: 'Gestión de evaluaciones' },
            { name: 'Leaderboard', description: 'Tablas de clasificación' },
            { name: 'AI Assistant', description: 'Asistente IA para generar contenido' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [
        path_1.default.join(__dirname, 'presentation/routes/*.js'),
        path_1.default.join(__dirname, 'presentation/controllers/*.js'),
    ],
};
const swaggerSpecs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Algorithmic Challenges API'
}));
// ⚠️ Manejo de errores
app.use(errorHandler_1.ErrorHandler.notFound);
app.use(errorHandler_1.ErrorHandler.handle);
// 🔌 Conexión a Mongo y arranque
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/algorithmic-challenges';
mongoose_1.default.connect(DATABASE_URL)
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
exports.default = app;
//# sourceMappingURL=index.js.map