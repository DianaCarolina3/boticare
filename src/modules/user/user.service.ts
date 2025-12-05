// Implementa la lógica de negocio -> Service
import { UserRepository } from './user.repository.js';
import { AuthService } from '../auth/auth.service.js';
import type { UserDto, UserUpdateDto, UserCreateDto, UserResponseDto } from './user.schema.js';
import { hashPassword } from '../../utils/hash.js';
import { Errors } from '../../utils/errors.js';

export class UserService {
   constructor(
      private readonly userRepository: UserRepository,
      private readonly authService: AuthService,
   ) {}

   async getAllUsers(): Promise<UserResponseDto[]> {
      return await this.userRepository.findAll();
   }

   async getByNameAndLastname(
      name?: UserDto['name'],
      lastname?: UserDto['lastname'],
   ): Promise<UserResponseDto[]> {
      const users = await this.userRepository.findNameAndLastname(name, lastname);

      if (!users || users.length === 0) {
         throw new Errors('Users not found', 404);
      }

      return users;
   }

   async getByIdUser(id: UserDto['id']): Promise<UserResponseDto | boolean> {
      const user = await this.userRepository.findById(id);

      if (user === false) {
         throw new Errors('User not found', 404);
      }

      return user;
   }

   async postNewUser(body: UserCreateDto): Promise<UserResponseDto> {
      // Hasear contraseña
      let hashedPassword = await hashPassword(body.password);
      // quitar espacios en cel
      let celWithoutSpaces = body.cel?.split(' ').join('');

      // evitar email duplicado en db
      const emailExists = await this.userRepository.findEmail(body.email);
      if (emailExists) {
         throw new Errors('Email exists or is in use', 409);
      }

      body.cel = celWithoutSpaces;
      body.password = hashedPassword;
      if (body.birthdate) {
         const date = new Date(body.birthdate);
         if (isNaN(date.getTime())) {
            throw new Errors('Birthdate format is invalid', 400);
         }
         body.birthdate = date.toISOString();
      } else {
         body.birthdate = undefined;
      }

      let { password, ...dataWithoutPassword } = body;

      const user = await this.userRepository.create(dataWithoutPassword);

      const authData = {
         password: password,
         userId: user.id,
      };

      await this.authService.register(authData);

      return user;
   }

   async patchUser(id: UserDto['id'], body: UserUpdateDto): Promise<UserResponseDto> {
      // buscar id para saber si existe y poder actualizarlo
      const user = await this.userRepository.findById(id);
      if (user === false) {
         throw new Errors('User not found', 404);
      }

      // si viene el cel quitar espacios
      let celWithoutSpaces;
      if (body.cel) {
         celWithoutSpaces = body.cel.split(' ').join('');
         body.cel = celWithoutSpaces;
      }
      // verificar si email existe
      const emailExists = await this.userRepository.findEmail(body.email);
      if (emailExists) {
         throw new Errors('Email exists or is in use', 409);
      }

      let { password, ...dataWithoutPassword } = body;

      // actualizar password en auth
      if (password) {
         await this.authService.updatePassword(id, password as string);
      }

      return await this.userRepository.updateUser(id, dataWithoutPassword);
   }

   async deleteUser(id: UserDto['id']): Promise<string | void> {
      const user = await this.userRepository.findById(id);

      if (user === false) {
         throw new Errors('User not found', 404);
      }

      const result = await this.userRepository.delete(id);
      if (result) {
         return `User ${id} deleted`;
      }
   }
}
