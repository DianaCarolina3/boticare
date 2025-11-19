//Maneja las rutas y peticiones/respuestas HTTP	-> Service
import type { NextFunction, RequestHandler } from 'express';
import * as z from 'zod';
import { UserService } from './user.service.js';
import {
   idSchema,
   nameAndLastnameSchema,
   userCreateSchema,
   userUpdateSchema,
   type UserDto,
   type UserUpdateDto,
   type UserCreateDto,
} from './user.schema.js';
import * as response from '../../shared/response/ApiResponse.js';

export class UserController {
   constructor(private readonly userService: UserService) {}

   getAllOrByNameAndLastname: RequestHandler<
      //RequestHandler: params, res body, req body, req query
      Record<string, never>,
      UserDto[],
      Record<string, never>,
      { name?: string; lastname?: string }
   > = async (_req, res, next: NextFunction) => {
      try {
         // Get all
         if (!_req.query.name && !_req.query.lastname) {
            const users: UserDto[] = await this.userService.getAllUsers();
            return response.success(_req, res, users, 200);
         }

         // Validar name y lastname
         const nameAndLastnameValidation = nameAndLastnameSchema.safeParse(_req.query);
         if (!nameAndLastnameValidation.success) {
            const errorMessage = z.treeifyError(nameAndLastnameValidation.error);
            return response.error(_req, res, errorMessage.errors[0] ?? 'Validation error', 422);
         }

         // Get a filter query for name or/and lastname
         const { name, lastname } = nameAndLastnameValidation.data;
         const users: UserDto[] = await this.userService.getByNameAndLastname(name, lastname);
         return response.success(_req, res, users, 200);
      } catch (err) {
         next(err);
      }
   };

   getById: RequestHandler<
      { id: UserDto['id'] },
      UserDto[] | boolean,
      Record<string, never>,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      try {
         const idValidation = idSchema.safeParse(_req.params.id);
         if (!idValidation.success) {
            const errorMessage = z.treeifyError(idValidation.error);
            return response.error(_req, res, errorMessage.errors[0] ?? 'Validation error', 422);
         }

         const user: UserDto[] | boolean = await this.userService.getByIdUser(idValidation.data);

         return response.success(_req, res, user, 200);
      } catch (err) {
         next(err);
      }
   };

   postNewUser: RequestHandler<
      Record<string, never>,
      { message: string; id: string },
      UserCreateDto,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      try {
         // validar body
         const bodyValidation = userCreateSchema.safeParse(_req.body);
         if (!bodyValidation.success) {
            // 422 request funciona, pero la sintaxis del recurso no es correcta
            const errorMessage = z.flattenError(bodyValidation.error);
            return response.error(_req, res, errorMessage.fieldErrors, 422);
         }

         const newUser: UserDto = await this.userService.postNewUser(bodyValidation.data);
         return response.success(
            _req,
            res,
            {
               message: 'User created successfully',
               id: newUser.id,
            },
            200,
         );
      } catch (err) {
         next(err);
      }
   };

   patchUser: RequestHandler<
      { id: UserDto['id'] },
      UserUpdateDto[],
      UserUpdateDto,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      // Record<K, T> objeto clave, valor
      try {
         // validar id
         const idValidation = idSchema.safeParse(_req.params.id);
         if (!idValidation.success) {
            const errorMessage = z.treeifyError(idValidation.error);
            return response.error(_req, res, errorMessage.errors[0] ?? 'Validation error', 422);
         }

         // validar body
         const bodyValidation = userUpdateSchema.safeParse(_req.body);
         if (!bodyValidation.success) {
            const errorMessage = z.flattenError(bodyValidation.error);
            return response.error(_req, res, errorMessage.fieldErrors, 422);
         }

         const updatedUser: UserUpdateDto[] = await this.userService.patchUser(
            idValidation.data,
            bodyValidation.data,
         );

         return res.status(200).json(updatedUser);
      } catch (err) {
         next(err);
      }
   };

   deleteUser: RequestHandler<
      { id: UserDto['id'] },
      string,
      Record<string, never>,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      try {
         const idValidation = idSchema.safeParse(_req.params.id);
         if (!idValidation.success) {
            const errorMessage = z.treeifyError(idValidation.error);
            return response.error(_req, res, errorMessage.errors[0] ?? 'Validation error', 422);
         }

         const userDeleted = await this.userService.deleteUser(idValidation.data);

         return res.status(200).json(userDeleted);
      } catch (err) {
         next(err);
      }
   };
}
