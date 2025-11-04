import { IAuthService } from '../../domain/services/IAuthService';
import { User, LoginRequest, AuthResponse } from '../../domain/entities/User';
export declare class AuthService implements IAuthService {
    private readonly jwtSecret;
    private readonly jwtExpiresIn;
    constructor();
    login(credentials: LoginRequest): Promise<AuthResponse>;
    register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<AuthResponse>;
    validateToken(token: string): Promise<User | null>;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    generateToken(user: User): string;
    verifyToken(token: string): {
        userId: string;
        role: string;
    } | null;
}
//# sourceMappingURL=AuthService.d.ts.map