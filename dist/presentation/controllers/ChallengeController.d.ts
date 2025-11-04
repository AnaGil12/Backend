import { Request, Response } from 'express';
import { CreateChallengeUseCase } from '../../application/use-cases/challenges/CreateChallengeUseCase';
import { IChallengeRepository } from '../../domain/repositories/IChallengeRepository';
export declare class ChallengeController {
    private createChallengeUseCase;
    private challengeRepository;
    constructor(createChallengeUseCase: CreateChallengeUseCase, challengeRepository: IChallengeRepository);
    createChallenge(req: Request, res: Response): Promise<void>;
    getChallenges(req: Request, res: Response): Promise<void>;
    getChallengeById(req: Request, res: Response): Promise<void>;
    updateChallenge(req: Request, res: Response): Promise<void>;
    deleteChallenge(req: Request, res: Response): Promise<void>;
    searchChallenges(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ChallengeController.d.ts.map