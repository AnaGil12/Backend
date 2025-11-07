"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const User_1 = require("../../../domain/entities/User");
class RegisterUseCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    async execute(request) {
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new Error('User already exists with this email');
        }
        // Hash password
        const hashedPassword = await this.authService.hashPassword(request.password);
        // Create user
        const userData = {
            ...request,
            password: hashedPassword,
            role: request.role || User_1.UserRole.STUDENT
        };
        const user = await this.userRepository.create(userData);
        // Generate token
        const token = this.authService.generateToken(user);
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
}
exports.RegisterUseCase = RegisterUseCase;
//# sourceMappingURL=RegisterUseCase.js.map