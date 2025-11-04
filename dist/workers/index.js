"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const ProcessSubmissionUseCase_1 = require("../application/use-cases/submissions/ProcessSubmissionUseCase");
const Logger_1 = require("../infrastructure/services/Logger");
class Worker {
    constructor() {
        this.logger = new Logger_1.Logger('Worker');
        this.submissionQueue = new bull_1.default('submission processing', process.env.REDIS_URL || 'redis://localhost:6379');
        const submissionRepository = {};
        const runnerService = {};
        const leaderboardRepository = {};
        this.processSubmissionUseCase = new ProcessSubmissionUseCase_1.ProcessSubmissionUseCase(submissionRepository, runnerService, leaderboardRepository);
        this.setupQueue();
    }
    setupQueue() {
        this.submissionQueue.process('process-submission', async (job) => {
            const jobData = job.data;
            this.logger.info('Processing submission job', {
                jobId: job.id,
                submissionId: jobData.submissionId,
                userId: jobData.userId,
                challengeId: jobData.challengeId,
                language: jobData.language
            });
            try {
                const result = await this.processSubmissionUseCase.execute(jobData.submissionId);
                this.logger.info('Submission processed successfully', {
                    jobId: job.id,
                    submissionId: jobData.submissionId,
                    status: result.status,
                    score: result.score
                });
                return result;
            }
            catch (error) {
                this.logger.error('Failed to process submission', {
                    jobId: job.id,
                    submissionId: jobData.submissionId,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
                throw error;
            }
        });
        this.submissionQueue.on('completed', (job, result) => {
            this.logger.info('Job completed', {
                jobId: job.id,
                submissionId: job.data.submissionId,
                result
            });
        });
        this.submissionQueue.on('failed', (job, err) => {
            this.logger.error('Job failed', {
                jobId: job.id,
                submissionId: job.data.submissionId,
                error: err.message,
                stack: err.stack
            });
        });
        this.submissionQueue.on('stalled', (job) => {
            this.logger.warn('Job stalled', {
                jobId: job.id,
                submissionId: job.data.submissionId
            });
        });
        this.logger.info('Worker started and listening for jobs');
    }
    async start() {
        this.logger.info('Starting worker...');
        process.on('SIGINT', () => {
            this.logger.info('Received SIGINT, shutting down gracefully...');
            this.submissionQueue.close();
            process.exit(0);
        });
        process.on('SIGTERM', () => {
            this.logger.info('Received SIGTERM, shutting down gracefully...');
            this.submissionQueue.close();
            process.exit(0);
        });
    }
}
const worker = new Worker();
worker.start().catch((error) => {
    console.error('Failed to start worker:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map