import { Request, Response, NextFunction } from 'express';
export declare class ErrorHandler {
    private static logger;
    static handle(error: Error, req: Request, res: Response, next: NextFunction): void;
    static notFound(req: Request, res: Response): void;
    static asyncHandler(fn: Function): (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=errorHandler.d.ts.map