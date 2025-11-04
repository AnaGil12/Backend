import { ISubmissionRepository } from '../../../domain/repositories/ISubmissionRepository';
import { IRunnerService } from '../../../domain/services/IRunnerService';
import { ILeaderboardRepository } from '../../../domain/repositories/ILeaderboardRepository';
import { SubmissionResult } from '../../../domain/entities/Submission';
export declare class ProcessSubmissionUseCase {
    private submissionRepository;
    private runnerService;
    private leaderboardRepository;
    constructor(submissionRepository: ISubmissionRepository, runnerService: IRunnerService, leaderboardRepository: ILeaderboardRepository);
    execute(submissionId: string): Promise<SubmissionResult>;
}
//# sourceMappingURL=ProcessSubmissionUseCase.d.ts.map