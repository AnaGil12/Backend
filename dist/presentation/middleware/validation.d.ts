import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare class ValidationMiddleware {
    static validate(schema: Joi.ObjectSchema): (req: Request, res: Response, next: NextFunction) => void;
    static validateQuery(schema: Joi.ObjectSchema): (req: Request, res: Response, next: NextFunction) => void;
    static validateParams(schema: Joi.ObjectSchema): (req: Request, res: Response, next: NextFunction) => void;
}
export declare const AuthSchemas: {
    login: Joi.ObjectSchema<any>;
    register: Joi.ObjectSchema<any>;
};
export declare const ChallengeSchemas: {
    create: Joi.ObjectSchema<any>;
    update: Joi.ObjectSchema<any>;
};
export declare const SubmissionSchemas: {
    create: Joi.ObjectSchema<any>;
};
export declare const CourseSchemas: {
    create: Joi.ObjectSchema<any>;
    update: Joi.ObjectSchema<any>;
    enroll: Joi.ObjectSchema<any>;
};
export declare const EvaluationSchemas: {
    create: Joi.ObjectSchema<any>;
    update: Joi.ObjectSchema<any>;
};
export declare const CommonSchemas: {
    id: Joi.ObjectSchema<any>;
    pagination: Joi.ObjectSchema<any>;
    challengeList: Joi.ObjectSchema<any>;
    courseList: Joi.ObjectSchema<any>;
    submissionList: Joi.ObjectSchema<any>;
};
//# sourceMappingURL=validation.d.ts.map