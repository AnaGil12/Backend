"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonSchemas = exports.EvaluationSchemas = exports.CourseSchemas = exports.SubmissionSchemas = exports.ChallengeSchemas = exports.AuthSchemas = exports.ValidationMiddleware = void 0;
const joi_1 = __importDefault(require("joi"));
class ValidationMiddleware {
    static validate(schema) {
        return (req, res, next) => {
            const { error } = schema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message
                    }))
                });
                return;
            }
            next();
        };
    }
    static validateQuery(schema) {
        return (req, res, next) => {
            const { error } = schema.validate(req.query);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: 'Query validation error',
                    errors: error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message
                    }))
                });
                return;
            }
            next();
        };
    }
    static validateParams(schema) {
        return (req, res, next) => {
            const { error } = schema.validate(req.params);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: 'Parameter validation error',
                    errors: error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message
                    }))
                });
                return;
            }
            next();
        };
    }
}
exports.ValidationMiddleware = ValidationMiddleware;
// Validation schemas
exports.AuthSchemas = {
    login: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required()
    }),
    register: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        firstName: joi_1.default.string().min(2).max(50).required(),
        lastName: joi_1.default.string().min(2).max(50).required(),
        role: joi_1.default.string().valid('STUDENT', 'ADMIN', 'PROFESSOR').optional()
    })
};
exports.ChallengeSchemas = {
    create: joi_1.default.object({
        title: joi_1.default.string().min(3).max(200).required(),
        description: joi_1.default.string().min(10).required(),
        difficulty: joi_1.default.string().valid('Easy', 'Medium', 'Hard').required(),
        tags: joi_1.default.array().items(joi_1.default.string()).min(1).required(),
        timeLimit: joi_1.default.number().min(100).max(10000).required(),
        memoryLimit: joi_1.default.number().min(64).max(1024).required(),
        courseId: joi_1.default.string().required(),
        testCases: joi_1.default.array().items(joi_1.default.object({
            input: joi_1.default.string().required(),
            expectedOutput: joi_1.default.string().required(),
            isHidden: joi_1.default.boolean().default(false),
            order: joi_1.default.number().min(1).required()
        })).min(1).required()
    }),
    update: joi_1.default.object({
        title: joi_1.default.string().min(3).max(200).optional(),
        description: joi_1.default.string().min(10).optional(),
        difficulty: joi_1.default.string().valid('Easy', 'Medium', 'Hard').optional(),
        tags: joi_1.default.array().items(joi_1.default.string()).min(1).optional(),
        timeLimit: joi_1.default.number().min(100).max(10000).optional(),
        memoryLimit: joi_1.default.number().min(64).max(1024).optional(),
        status: joi_1.default.string().valid('draft', 'published', 'archived').optional(),
        testCases: joi_1.default.array().items(joi_1.default.object({
            input: joi_1.default.string().required(),
            expectedOutput: joi_1.default.string().required(),
            isHidden: joi_1.default.boolean().default(false),
            order: joi_1.default.number().min(1).required()
        })).min(1).optional()
    })
};
exports.SubmissionSchemas = {
    create: joi_1.default.object({
        challengeId: joi_1.default.string().required(),
        courseId: joi_1.default.string().required(),
        language: joi_1.default.string().valid('python', 'javascript', 'cpp', 'java').required(),
        code: joi_1.default.string().min(10).required()
    })
};
exports.CourseSchemas = {
    create: joi_1.default.object({
        name: joi_1.default.string().min(3).max(200).required(),
        code: joi_1.default.string().min(2).max(20).required(),
        description: joi_1.default.string().min(10).required(),
        period: joi_1.default.string().required(),
        group: joi_1.default.number().min(1).required(),
        professorIds: joi_1.default.array().items(joi_1.default.string()).optional()
    }),
    update: joi_1.default.object({
        name: joi_1.default.string().min(3).max(200).optional(),
        code: joi_1.default.string().min(2).max(20).optional(),
        description: joi_1.default.string().min(10).optional(),
        period: joi_1.default.string().optional(),
        group: joi_1.default.number().min(1).optional(),
        professorIds: joi_1.default.array().items(joi_1.default.string()).optional(),
        isActive: joi_1.default.boolean().optional()
    }),
    enroll: joi_1.default.object({
        studentId: joi_1.default.string().required()
    })
};
exports.EvaluationSchemas = {
    create: joi_1.default.object({
        name: joi_1.default.string().min(3).max(200).required(),
        description: joi_1.default.string().min(10).required(),
        courseId: joi_1.default.string().required(),
        challengeIds: joi_1.default.array().items(joi_1.default.string()).min(1).required(),
        startDate: joi_1.default.date().required(),
        endDate: joi_1.default.date().greater(joi_1.default.ref('startDate')).required(),
        durationMinutes: joi_1.default.number().min(15).max(480).required(),
        maxAttempts: joi_1.default.number().min(1).max(10).required()
    }),
    update: joi_1.default.object({
        name: joi_1.default.string().min(3).max(200).optional(),
        description: joi_1.default.string().min(10).optional(),
        challengeIds: joi_1.default.array().items(joi_1.default.string()).min(1).optional(),
        startDate: joi_1.default.date().optional(),
        endDate: joi_1.default.date().optional(),
        durationMinutes: joi_1.default.number().min(15).max(480).optional(),
        maxAttempts: joi_1.default.number().min(1).max(10).optional(),
        status: joi_1.default.string().valid('draft', 'scheduled', 'active', 'finished', 'cancelled').optional()
    })
};
exports.CommonSchemas = {
    id: joi_1.default.object({
        id: joi_1.default.string().required()
    }),
    pagination: joi_1.default.object({
        limit: joi_1.default.number().min(1).max(100).default(50),
        offset: joi_1.default.number().min(0).default(0)
    }).unknown(true), // Allow additional query parameters
    challengeList: joi_1.default.object({
        limit: joi_1.default.number().min(1).max(100).default(50).optional(),
        offset: joi_1.default.number().min(0).default(0).optional(),
        courseId: joi_1.default.string().optional(),
        status: joi_1.default.string().valid('draft', 'published', 'archived').optional(),
        difficulty: joi_1.default.string().valid('Easy', 'Medium', 'Hard').optional(),
        tags: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.array().items(joi_1.default.string())).optional()
    }),
    courseList: joi_1.default.object({
        limit: joi_1.default.number().min(1).max(100).default(50).optional(),
        offset: joi_1.default.number().min(0).default(0).optional(),
        period: joi_1.default.string().optional()
    }),
    submissionList: joi_1.default.object({
        limit: joi_1.default.number().min(1).max(100).default(50).optional(),
        offset: joi_1.default.number().min(0).default(0).optional(),
        userId: joi_1.default.string().optional(),
        challengeId: joi_1.default.string().optional(),
        courseId: joi_1.default.string().optional(),
        status: joi_1.default.string().valid('pending', 'running', 'accepted', 'rejected', 'error').optional(),
        language: joi_1.default.string().valid('python', 'javascript', 'cpp', 'java').optional()
    })
};
//# sourceMappingURL=validation.js.map