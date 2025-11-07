"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
class AuthMiddleware {
    constructor(authService) {
        this.authService = authService;
        this.authenticate = (req, res, next) => {
            try {
                const token = req.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    res.status(401).json({
                        success: false,
                        message: 'Access token is required'
                    });
                    return;
                }
                const decoded = this.authService.verifyToken(token);
                if (!decoded) {
                    res.status(401).json({
                        success: false,
                        message: 'Invalid or expired token'
                    });
                    return;
                }
                req.user = {
                    userId: decoded.userId,
                    role: decoded.role,
                    email: '' // Will be populated if needed
                };
                next();
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    message: 'Token validation failed'
                });
            }
        };
        this.authorize = (...roles) => {
            return (req, res, next) => {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                    return;
                }
                if (!roles.includes(req.user.role)) {
                    res.status(403).json({
                        success: false,
                        message: 'Insufficient permissions'
                    });
                    return;
                }
                next();
            };
        };
        this.optionalAuth = (req, res, next) => {
            try {
                const token = req.headers.authorization?.replace('Bearer ', '');
                if (token) {
                    const decoded = this.authService.verifyToken(token);
                    if (decoded) {
                        req.user = {
                            userId: decoded.userId,
                            role: decoded.role,
                            email: ''
                        };
                    }
                }
                next();
            }
            catch (error) {
                // Continue without authentication for optional auth
                next();
            }
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.js.map