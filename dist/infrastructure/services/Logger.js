"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
class Logger {
    constructor(service) {
        this.logger = winston_1.default.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
            defaultMeta: { service },
            transports: [
                new winston_1.default.transports.File({
                    filename: path_1.default.join(process.env.LOG_FILE || './logs/error.log'),
                    level: 'error'
                }),
                new winston_1.default.transports.File({
                    filename: path_1.default.join(process.env.LOG_FILE || './logs/combined.log')
                })
            ]
        });
        // Add console transport in development
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston_1.default.transports.Console({
                format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
            }));
        }
    }
    info(message, meta) {
        this.logger.info(message, meta);
    }
    error(message, meta) {
        this.logger.error(message, meta);
    }
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
    debug(message, meta) {
        this.logger.debug(message, meta);
    }
    // Structured logging for submissions
    logSubmission(submissionId, event, data) {
        this.info(`Submission ${event}`, {
            submissionId,
            event,
            timestamp: new Date().toISOString(),
            ...data
        });
    }
    // Structured logging for API requests
    logRequest(req, res, responseTime) {
        this.info('API Request', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user?.userId
        });
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map