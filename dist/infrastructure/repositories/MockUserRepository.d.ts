import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, CreateUserRequest, UpdateUserRequest, LoginRequest } from '../../domain/entities/User';
export declare class MockUserRepository implements IUserRepository {
    private users;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(userData: CreateUserRequest): Promise<User>;
    update(id: string, userData: UpdateUserRequest): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    findAll(limit?: number, offset?: number): Promise<User[]>;
    findByRole(role: string): Promise<User[]>;
    findActiveUsers(): Promise<User[]>;
    validateCredentials(credentials: LoginRequest): Promise<User | null>;
}
//# sourceMappingURL=MockUserRepository.d.ts.map