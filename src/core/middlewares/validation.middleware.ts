import { z, ZodError, type ZodSchema } from 'zod';
import type { NextFunction, Request, Response } from 'express';
import * as response from '../../shared/response/ApiResponse.js';

export type TargetValidation = 'body' | 'query' | 'params';

const handleErrorValidation = (
   error: unknown,
   _req: Request,
   res: Response,
   next: NextFunction,
) => {
   if (error instanceof ZodError) {
      return response.error(_req, res, z.flattenError(error).fieldErrors, 422);
   }
   return next(error);
};

export const validate = (schema: ZodSchema, target: TargetValidation) => {
   return (_req: Request, res: Response, next: NextFunction) => {
      try {
         const dataToValidate = { ..._req[target] };
         _req[target] = schema.parse(dataToValidate);

         return next();
      } catch (error) {
         handleErrorValidation(error, _req, res, next);
      }
   };
};

// si la req es vacia no valida
export const validateOpcional = (schema: ZodSchema, target: TargetValidation) => {
   return (_req: Request, res: Response, next: NextFunction) => {
      try {
         const dataToValidate = { ..._req[target] };

         if (Object.keys(dataToValidate).length === 0) {
            return next();
         }
         _req[target] = schema.parse(dataToValidate);

         return next();
      } catch (error) {
         handleErrorValidation(error, _req, res, next);
      }
   };
};
