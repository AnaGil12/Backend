import { Router } from 'express';
import { SubmissionController } from '../controllers/SubmissionController';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware, SubmissionSchemas, CommonSchemas } from '../middleware/validation';
import { ErrorHandler } from '../middleware/errorHandler';

export function createSubmissionRoutes(
  submissionController: SubmissionController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Apply authentication to all routes
  router.use(authMiddleware.authenticate);

  // POST /submissions
  router.post(
    '/',
    ValidationMiddleware.validate(SubmissionSchemas.create),
    ErrorHandler.asyncHandler(submissionController.submitSolution.bind(submissionController))
  );

  // GET /submissions
  router.get(
    '/',
    ValidationMiddleware.validateQuery(CommonSchemas.pagination),
    ErrorHandler.asyncHandler(submissionController.getSubmissions.bind(submissionController))
  );

  // GET /submissions/my
  router.get(
    '/my',
    ValidationMiddleware.validateQuery(CommonSchemas.pagination),
    ErrorHandler.asyncHandler(submissionController.getMySubmissions.bind(submissionController))
  );

  // GET /submissions/stats
  router.get(
    '/stats',
    ErrorHandler.asyncHandler(submissionController.getSubmissionStats.bind(submissionController))
  );

  // GET /submissions/:id
  router.get(
    '/:id',
    ValidationMiddleware.validateParams(CommonSchemas.id),
    ErrorHandler.asyncHandler(submissionController.getSubmissionById.bind(submissionController))
  );

  return router;
}

