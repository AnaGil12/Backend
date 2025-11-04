"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'default-secret';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    }
    async login(credentials) {
        throw new Error('Method not implemented. Use LoginUseCase instead.');
    }
    async register(userData) {
        throw new Error('Method not implemented. Use RegisterUseCase instead.');
    }
    async validateToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            return {
                id: decoded.userId,
                email: decoded.email,
                password: '',
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                role: decoded.role,
                isActive: decoded.isActive,
                createdAt: new Date(decoded.createdAt),
                updatedAt: new Date(decoded.updatedAt)
            };
        }
        catch (error) {
            return null;
        }
    }
    async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn
        });
    }
    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            return {
                userId: decoded.userId,
                role: decoded.role
            };
        }
        catch (error) {
            return null;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map