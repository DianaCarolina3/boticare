//Maneja las rutas y peticiones/respuestas HTTP	-> Service
import type { NextFunction, RequestHandler } from 'express';
import { UserService } from './user.service.js';
import { type UserDto, type UserUpdateDto, type UserCreateDto } from './user.schema.js';
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

         // Get a filter query for name or/and lastname
         const { name, lastname } = _req.query;
         const users: UserDto[] = await this.userService.getByNameAndLastname(name, lastname);
         return response.success(_req, res, users, 200);
      } catch (err) {
         return next(err);
      }
   };

   getById: RequestHandler<
      { id: UserDto['id'] },
      UserDto[] | boolean,
      Record<string, never>,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      try {
         const user: UserDto[] | boolean = await this.userService.getByIdUser(_req.params.id);

         return response.success(_req, res, user, 200);
      } catch (err) {
         return next(err);
      }
   };

   postNewUser: RequestHandler<
      Record<string, never>,
      { message: string; id: string },
      UserCreateDto,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      try {
         const newUser: UserDto = await this.userService.postNewUser(_req.body);
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
         return next(err);
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
         const updatedUser: UserUpdateDto[] = await this.userService.patchUser(
            _req.params.id,
            _req.body,
         );

         return res.status(200).json(updatedUser);
      } catch (err) {
         return next(err);
      }
   };

   deleteUser: RequestHandler<
      { id: UserDto['id'] },
      string,
      Record<string, never>,
      Record<string, never>
   > = async (_req, res, next: NextFunction) => {
      try {
         const userDeleted = await this.userService.deleteUser(_req.params.id);

         return res.status(200).json(userDeleted);
      } catch (err) {
         return next(err);
      }
   };
}
