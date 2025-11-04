import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAuthService } from '../../../domain/services/IAuthService';
import { LoginRequest, AuthResponse } from '../../../domain/entities/User';
export declare class LoginUseCase {
    private userRepository;
    private authService;
    constructor(userRepository: IUserRepository, authService: IAuthService);
    execute(request: LoginRequest): Promise<AuthResponse>;
}
//# sourceMappingURL=LoginUseCase.d.ts.map