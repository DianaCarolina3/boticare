import type { Response, Request, NextFunction } from 'express';
import { Errors } from '../../utils/errors.js';

export function success(_req: Request, res: Response, message: unknown, status: number) {
   let statusCode = status;
   let statusMessage = message;

   if (!statusCode) {
      statusCode = 200;
   }
   if (!message) {
      statusMessage = 'Ok';
   }

   res.status(statusCode).json({
      status: statusCode,
      body: statusMessage,
   });
}

export function error(
   _req: Request,
   res: Response,
   message: unknown,
   status: number,
   errorStack?: string,
) {
   let statusCode = status;
   let statusMessage = message;

   if (!statusCode) {
      statusCode = 500;
   }
   if (!message) {
      statusMessage = 'Client error';
   }

   if (statusCode >= 500) {
      res.status(statusCode).json({
         status: statusCode,
         body: statusMessage,
         error: errorStack,
      });
   } else {
      res.status(statusCode).json({
         status: statusCode,
         body: statusMessage,
      });
   }
}

export function handlerError(err: Errors, _req: Request, res: Response, _next: NextFunction) {
   error(_req, res, err.message, err.status, err.stack);
}
