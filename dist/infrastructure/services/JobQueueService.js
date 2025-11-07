"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobQueueService = void 0;
const bull_1 = __importDefault(require("bull"));
const Submission_1 = require("../../domain/entities/Submission");
class JobQueueService {
    constructor() {
        this.submissionQueue = new bull_1.default('submission processing', process.env.REDIS_URL || 'redis://localhost:6379');
        this.setupQueue();
    }
    setupQueue() {
        // Process jobs
        this.submissionQueue.process('process-submission', async (job) => {
            const jobData = job.data;
            return await this.processSubmissionJob(jobData);
        });
        // Handle completed jobs
        this.submissionQueue.on('completed', (job, result) => {
            console.log(`Job ${job.id} completed with result:`, result);
        });
        // Handle failed jobs
        this.submissionQueue.on('failed', (job, err) => {
            console.error(`Job ${job.id} failed:`, err);
        });
    }
    async addSubmissionJob(jobData) {
        await this.submissionQueue.add('process-submission', jobData, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            },
            removeOnComplete: 10,
            removeOnFail: 5
        });
    }
    async processSubmissionJob(jobData) {
        // This will be implemented by the worker
        // For now, return a mock result
        return {
            submissionId: jobData.submissionId,
            status: Submission_1.SubmissionStatus.ACCEPTED,
            score: 100,
            timeMsTotal: 500,
            memoryKbTotal: 1024,
            testCaseResults: []
        };
    }
    async getJobStatus(jobId) {
        const job = await this.submissionQueue.getJob(jobId);
        if (!job) {
            return 'NOT_FOUND';
        }
        return await job.getState();
    }
    async retryFailedJob(jobId) {
        const job = await this.submissionQueue.getJob(jobId);
        if (job) {
            await job.retry();
        }
    }
    async getQueueStats() {
        const waiting = await this.submissionQueue.getWaiting();
        const active = await this.submissionQueue.getActive();
        const completed = await this.submissionQueue.getCompleted();
        const failed = await this.submissionQueue.getFailed();
        return {
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length
        };
    }
}
exports.JobQueueService = JobQueueService;
//# sourceMappingURL=JobQueueService.js.map