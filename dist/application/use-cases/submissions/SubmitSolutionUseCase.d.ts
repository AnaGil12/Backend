import { ISubmissionRepository } from '../../../domain/repositories/ISubmissionRepository';
import { IChallengeRepository } from '../../../domain/repositories/IChallengeRepository';
import { ICourseRepository } from '../../../domain/repositories/ICourseRepository';
import { IJobQueueService } from '../../../domain/services/IJobQueueService';
import { CreateSubmissionRequest, Submission } from '../../../domain/entities/Submission';
export declare class SubmitSolutionUseCase {
    private submissionRepository;
    private challengeRepository;
    private courseRepository;
    private jobQueueService;
    constructor(submissionRepository: ISubmissionRepository, challengeRepository: IChallengeRepository, courseRepository: ICourseRepository, jobQueueService: IJobQueueService);
    execute(request: CreateSubmissionRequest, userId: string): Promise<Submission>;
}
//# sourceMappingURL=SubmitSolutionUseCase.d.ts.map