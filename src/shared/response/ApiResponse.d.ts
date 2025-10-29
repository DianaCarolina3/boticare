import type { Response, Request } from "express";
import { Errors } from "../../utils/errors.js";
export declare function success(_req: Request, res: Response, message: unknown, status: number): void;
export declare function error(_req: Request, res: Response, message: string, status: number, errorStack?: string): void;
export declare function handlerError(err: Errors, _req: Request, res: Response, _next: Function): void;
//# sourceMappingURL=ApiResponse.d.ts.map