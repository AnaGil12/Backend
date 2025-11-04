import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ValidationMiddleware, AuthSchemas } from '../middleware/validation';
import { ErrorHandler } from '../middleware/errorHandler';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  // POST /auth/login
  router.post(
    '/login',
    ValidationMiddleware.validate(AuthSchemas.login),
    ErrorHandler.asyncHandler(authController.login.bind(authController))
  );

  // POST /auth/register
  router.post(
    '/register',
    ValidationMiddleware.validate(AuthSchemas.register),
    ErrorHandler.asyncHandler(authController.register.bind(authController))
  );

  // GET /auth/me
  router.get(
    '/me',
    ErrorHandler.asyncHandler(authController.me.bind(authController))
  );

  // POST /auth/refresh
  router.post(
    '/refresh',
    ErrorHandler.asyncHandler(authController.refreshToken.bind(authController))
  );

  return router;
}

