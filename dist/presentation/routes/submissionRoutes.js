"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubmissionRoutes = createSubmissionRoutes;
const express_1 = require("express");
const validation_1 = require("../middleware/validation");
const errorHandler_1 = require("../middleware/errorHandler");
function createSubmissionRoutes(submissionController, authMiddleware) {
    const router = (0, express_1.Router)();
    // Apply authentication to all routes
    router.use(authMiddleware.authenticate);
    /**
     * @swagger
     * /api/submissions:
     *   post:
     *     summary: Submit a solution
     *     tags: [Submissions]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - challengeId
     *               - courseId
     *               - language
     *               - code
     *             properties:
     *               challengeId:
     *                 type: string
     *               courseId:
     *                 type: string
     *               language:
     *                 type: string
     *                 enum: [python, javascript, cpp, java]
     *               code:
     *                 type: string
     *                 example: "def solution():\n    return True"
     *     responses:
     *       201:
     *         description: Solution submitted successfully
     *       400:
     *         description: Validation error
     */
    router.post('/', validation_1.ValidationMiddleware.validate(validation_1.SubmissionSchemas.create), errorHandler_1.ErrorHandler.asyncHandler(submissionController.submitSolution.bind(submissionController)));
    /**
     * @swagger
     * /api/submissions:
     *   get:
     *     summary: List all submissions
     *     tags: [Submissions]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 50
     *       - in: query
     *         name: offset
     *         schema:
     *           type: integer
     *           default: 0
     *     responses:
     *       200:
     *         description: List of submissions
     */
    router.get('/', validation_1.ValidationMiddleware.validateQuery(validation_1.CommonSchemas.pagination), errorHandler_1.ErrorHandler.asyncHandler(submissionController.getSubmissions.bind(submissionController)));
    /**
     * @swagger
     * /api/submissions/my:
     *   get:
     *     summary: Get current user's submissions
     *     tags: [Submissions]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 50
     *       - in: query
     *         name: offset
     *         schema:
     *           type: integer
     *           default: 0
     *     responses:
     *       200:
     *         description: User's submissions
     */
    router.get('/my', validation_1.ValidationMiddleware.validateQuery(validation_1.CommonSchemas.pagination), errorHandler_1.ErrorHandler.asyncHandler(submissionController.getMySubmissions.bind(submissionController)));
    /**
     * @swagger
     * /api/submissions/stats:
     *   get:
     *     summary: Get submission statistics
     *     tags: [Submissions]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Submission statistics
     */
    router.get('/stats', errorHandler_1.ErrorHandler.asyncHandler(submissionController.getSubmissionStats.bind(submissionController)));
    /**
     * @swagger
     * /api/submissions/{id}:
     *   get:
     *     summary: Get submission by ID
     *     tags: [Submissions]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Submission details
     *       404:
     *         description: Submission not found
     */
    router.get('/:id', validation_1.ValidationMiddleware.validateParams(validation_1.CommonSchemas.id), errorHandler_1.ErrorHandler.asyncHandler(submissionController.getSubmissionById.bind(submissionController)));
    return router;
}
//# sourceMappingURL=submissionRoutes.js.map