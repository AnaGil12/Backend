import { IChallengeRepository } from '../../../domain/repositories/IChallengeRepository';
import { ICourseRepository } from '../../../domain/repositories/ICourseRepository';
import { CreateChallengeRequest, Challenge } from '../../../domain/entities/Challenge';
import { UserRole } from '../../../domain/entities/User';
export declare class CreateChallengeUseCase {
    private challengeRepository;
    private courseRepository;
    constructor(challengeRepository: IChallengeRepository, courseRepository: ICourseRepository);
    execute(request: CreateChallengeRequest, userId: string, userRole?: UserRole): Promise<Challenge>;
}
//# sourceMappingURL=CreateChallengeUseCase.d.ts.map