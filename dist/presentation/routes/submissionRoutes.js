"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubmissionRoutes = createSubmissionRoutes;
const express_1 = require("express");
const validation_1 = require("../middleware/validation");
const errorHandler_1 = require("../middleware/errorHandler");
function createSubmissionRoutes(submissionController, authMiddleware) {
    const router = (0, express_1.Router)();
    router.use(authMiddleware.authenticate);
    router.post('/', validation_1.ValidationMiddleware.validate(validation_1.SubmissionSchemas.create), errorHandler_1.ErrorHandler.asyncHandler(submissionController.submitSolution.bind(submissionController)));
    router.get('/', validation_1.ValidationMiddleware.validateQuery(validation_1.CommonSchemas.pagination), errorHandler_1.ErrorHandler.asyncHandler(submissionController.getSubmissions.bind(submissionController)));
    router.get('/my', validation_1.ValidationMiddleware.validateQuery(validation_1.CommonSchemas.pagination), errorHandler_1.ErrorHandler.asyncHandler(submissionController.getMySubmissions.bind(submissionController)));
    router.get('/stats', errorHandler_1.ErrorHandler.asyncHandler(submissionController.getSubmissionStats.bind(submissionController)));
    router.get('/:id', validation_1.ValidationMiddleware.validateParams(validation_1.CommonSchemas.id), errorHandler_1.ErrorHandler.asyncHandler(submissionController.getSubmissionById.bind(submissionController)));
    return router;
}
//# sourceMappingURL=submissionRoutes.js.map