import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAuthService } from '../../../domain/services/IAuthService';
import { CreateUserRequest, AuthResponse } from '../../../domain/entities/User';
export declare class RegisterUseCase {
    private userRepository;
    private authService;
    constructor(userRepository: IUserRepository, authService: IAuthService);
    execute(request: CreateUserRequest): Promise<AuthResponse>;
}
//# sourceMappingURL=RegisterUseCase.d.ts.map