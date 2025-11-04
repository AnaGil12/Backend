"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../../domain/entities/User");
class AuthController {
    constructor(loginUseCase, registerUseCase, authService) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
        this.authService = authService;
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
                return;
            }
            const result = await this.loginUseCase.execute({ email, password });
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Login failed'
            });
        }
    }
    async register(req, res) {
        try {
            const { email, password, firstName, lastName, role } = req.body;
            if (!email || !password || !firstName || !lastName) {
                res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                });
                return;
            }
            const result = await this.registerUseCase.execute({
                email,
                password,
                firstName,
                lastName,
                role: role || User_1.UserRole.STUDENT
            });
            res.status(201).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Registration failed'
            });
        }
    }
    async me(req, res) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Token is required'
                });
                return;
            }
            const user = await this.authService.validateToken(token);
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
                return;
            }
            const { password, ...userWithoutPassword } = user;
            res.status(200).json({
                success: true,
                data: { user: userWithoutPassword }
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: 'Token validation failed'
            });
        }
    }
    async refreshToken(req, res) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Token is required'
                });
                return;
            }
            const user = await this.authService.validateToken(token);
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
                return;
            }
            const newToken = this.authService.generateToken(user);
            const { password, ...userWithoutPassword } = user;
            res.status(200).json({
                success: true,
                data: {
                    user: userWithoutPassword,
                    token: newToken
                }
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: 'Token refresh failed'
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map