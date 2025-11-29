import type { AuthService } from './auth.service.js';
import type { NextFunction, RequestHandler } from 'express';
import type { AuthLoginDto, AuthResponseLoginDto } from './auth.schema.js';
import { Errors } from '../../utils/errors.js';
import * as response from '../../shared/response/ApiResponse.js';

export class AuthController {
   constructor(private readonly authService: AuthService) {}

   login: RequestHandler<
      Record<string, never>,
      AuthResponseLoginDto,
      AuthLoginDto,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      try {
         if (!_req.validatedBody) {
            throw new Errors('Body is required');
         }

         const result: AuthResponseLoginDto = await this.authService.login(
            _req.validatedBody?.email,
            _req.validatedBody?.password,
         );

         return response.success(_req, res, result, 200);
      } catch (err) {
         next(err);
      }
   };
}
