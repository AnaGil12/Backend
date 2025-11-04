"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChallengeRoutes = createChallengeRoutes;
const express_1 = require("express");
const validation_1 = require("../middleware/validation");
const errorHandler_1 = require("../middleware/errorHandler");
const User_1 = require("../../domain/entities/User");
function createChallengeRoutes(challengeController, authMiddleware) {
    const router = (0, express_1.Router)();
    router.use(authMiddleware.authenticate);
    router.post('/', validation_1.ValidationMiddleware.validate(validation_1.ChallengeSchemas.create), errorHandler_1.ErrorHandler.asyncHandler(challengeController.createChallenge.bind(challengeController)));
    router.get('/', validation_1.ValidationMiddleware.validateQuery(validation_1.CommonSchemas.pagination), errorHandler_1.ErrorHandler.asyncHandler(challengeController.getChallenges.bind(challengeController)));
    router.get('/search', errorHandler_1.ErrorHandler.asyncHandler(challengeController.searchChallenges.bind(challengeController)));
    router.get('/:id', validation_1.ValidationMiddleware.validateParams(validation_1.CommonSchemas.id), errorHandler_1.ErrorHandler.asyncHandler(challengeController.getChallengeById.bind(challengeController)));
    router.put('/:id', validation_1.ValidationMiddleware.validateParams(validation_1.CommonSchemas.id), validation_1.ValidationMiddleware.validate(validation_1.ChallengeSchemas.update), errorHandler_1.ErrorHandler.asyncHandler(challengeController.updateChallenge.bind(challengeController)));
    router.delete('/:id', validation_1.ValidationMiddleware.validateParams(validation_1.CommonSchemas.id), authMiddleware.authorize(User_1.UserRole.ADMIN, User_1.UserRole.PROFESSOR), errorHandler_1.ErrorHandler.asyncHandler(challengeController.deleteChallenge.bind(challengeController)));
    return router;
}
//# sourceMappingURL=challengeRoutes.js.map