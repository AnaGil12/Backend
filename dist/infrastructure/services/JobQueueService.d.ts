import { IJobQueueService, JobData } from '../../domain/services/IJobQueueService';
import { SubmissionResult } from '../../domain/entities/Submission';
export declare class JobQueueService implements IJobQueueService {
    private submissionQueue;
    constructor();
    private setupQueue;
    addSubmissionJob(jobData: JobData): Promise<void>;
    processSubmissionJob(jobData: JobData): Promise<SubmissionResult>;
    getJobStatus(jobId: string): Promise<string>;
    retryFailedJob(jobId: string): Promise<void>;
    getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }>;
}
//# sourceMappingURL=JobQueueService.d.ts.map