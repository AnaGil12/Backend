import express from 'express';
declare class Application {
    private app;
    private logger;
    constructor();
    private setupMiddleware;
    private setupRoutes;
    private setupErrorHandling;
    start(): Promise<void>;
    getApp(): express.Application;
}
declare const app: Application;
export default app;
//# sourceMappingURL=index.d.ts.map