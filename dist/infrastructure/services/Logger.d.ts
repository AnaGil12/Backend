export declare class Logger {
    private logger;
    constructor(service: string);
    info(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    logSubmission(submissionId: string, event: string, data?: any): void;
    logRequest(req: any, res: any, responseTime: number): void;
}
//# sourceMappingURL=Logger.d.ts.map