import { Request, Response } from 'express';
import { SubmitSolutionUseCase } from '../../application/use-cases/submissions/SubmitSolutionUseCase';
import { ISubmissionRepository } from '../../domain/repositories/ISubmissionRepository';
export declare class SubmissionController {
    private submitSolutionUseCase;
    private submissionRepository;
    constructor(submitSolutionUseCase: SubmitSolutionUseCase, submissionRepository: ISubmissionRepository);
    submitSolution(req: Request, res: Response): Promise<void>;
    getSubmissions(req: Request, res: Response): Promise<void>;
    getSubmissionById(req: Request, res: Response): Promise<void>;
    getMySubmissions(req: Request, res: Response): Promise<void>;
    getSubmissionStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=SubmissionController.d.ts.map