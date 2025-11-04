"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRoutes = createAuthRoutes;
const express_1 = require("express");
const validation_1 = require("../middleware/validation");
const errorHandler_1 = require("../middleware/errorHandler");
function createAuthRoutes(authController) {
    const router = (0, express_1.Router)();
    router.post('/login', validation_1.ValidationMiddleware.validate(validation_1.AuthSchemas.login), errorHandler_1.ErrorHandler.asyncHandler(authController.login.bind(authController)));
    router.post('/register', validation_1.ValidationMiddleware.validate(validation_1.AuthSchemas.register), errorHandler_1.ErrorHandler.asyncHandler(authController.register.bind(authController)));
    router.get('/me', errorHandler_1.ErrorHandler.asyncHandler(authController.me.bind(authController)));
    router.post('/refresh', errorHandler_1.ErrorHandler.asyncHandler(authController.refreshToken.bind(authController)));
    return router;
}
//# sourceMappingURL=authRoutes.js.map