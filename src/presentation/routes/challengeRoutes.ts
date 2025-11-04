import { Router } from 'express';
import { ChallengeController } from '../controllers/ChallengeController';
import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware, ChallengeSchemas, CommonSchemas } from '../middleware/validation';
import { ErrorHandler } from '../middleware/errorHandler';
import { UserRole } from '../../domain/entities/User';

export function createChallengeRoutes(
  challengeController: ChallengeController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Apply authentication to all routes
  router.use(authMiddleware.authenticate);

  // POST /challenges
  router.post(
    '/',
    ValidationMiddleware.validate(ChallengeSchemas.create),
    ErrorHandler.asyncHandler(challengeController.createChallenge.bind(challengeController))
  );

  // GET /challenges
  router.get(
    '/',
    ValidationMiddleware.validateQuery(CommonSchemas.pagination),
    ErrorHandler.asyncHandler(challengeController.getChallenges.bind(challengeController))
  );

  // GET /challenges/search
  router.get(
    '/search',
    ErrorHandler.asyncHandler(challengeController.searchChallenges.bind(challengeController))
  );

  // GET /challenges/:id
  router.get(
    '/:id',
    ValidationMiddleware.validateParams(CommonSchemas.id),
    ErrorHandler.asyncHandler(challengeController.getChallengeById.bind(challengeController))
  );

  // PUT /challenges/:id
  router.put(
    '/:id',
    ValidationMiddleware.validateParams(CommonSchemas.id),
    ValidationMiddleware.validate(ChallengeSchemas.update),
    ErrorHandler.asyncHandler(challengeController.updateChallenge.bind(challengeController))
  );

  // DELETE /challenges/:id
  router.delete(
    '/:id',
    ValidationMiddleware.validateParams(CommonSchemas.id),
    authMiddleware.authorize(UserRole.ADMIN, UserRole.PROFESSOR),
    ErrorHandler.asyncHandler(challengeController.deleteChallenge.bind(challengeController))
  );

  return router;
}

