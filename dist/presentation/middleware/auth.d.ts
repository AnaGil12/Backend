import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../../domain/services/IAuthService';
import { UserRole } from '../../domain/entities/User';
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: UserRole;
        email: string;
    };
}
export declare class AuthMiddleware {
    private authService;
    constructor(authService: IAuthService);
    authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    authorize: (...roles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=auth.d.ts.map