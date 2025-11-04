import { Request, Response } from 'express';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { IAuthService } from '../../domain/services/IAuthService';
export declare class AuthController {
    private loginUseCase;
    private registerUseCase;
    private authService;
    constructor(loginUseCase: LoginUseCase, registerUseCase: RegisterUseCase, authService: IAuthService);
    login(req: Request, res: Response): Promise<void>;
    register(req: Request, res: Response): Promise<void>;
    me(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map