// Implementa la lógica de negocio -> Service
import { UserRepository } from './user.repository.js';
import { AuthService } from '../auth/auth.service.js';
import type { UserDto, UserUpdateDto, UserCreateDto } from './user.schema.js';
import { hashPassword } from '../../utils/hash.js';
import { Errors } from '../../utils/errors.js';

export class UserService {
   constructor(private readonly userRepository: UserRepository) {}

   async getAllUsers(): Promise<UserDto[]> {
      return await this.userRepository.find();
   }

   async getByNameAndLastname(
      name?: UserDto['name'],
      lastname?: UserDto['lastname'],
   ): Promise<UserDto[]> {
      const users: UserDto[] = await this.userRepository.findNameAndLastname(name, lastname);

      if (!users || users.length === 0) {
         throw new Errors('Users not found', 404);
      }

      return users;
   }

   async getByIdUser(id: UserDto['id']): Promise<UserDto[] | boolean> {
      const user = await this.userRepository.findId(id);

      if (user === false) {
         throw new Errors('User not found', 404);
      }

      return user;
   }

   async postNewUser(body: UserCreateDto): Promise<UserDto> {
      // Hasear contrasena
      let hashedPassword = await hashPassword(body.password);
      // quitar espacios en cel
      let celWithoutSpaces = body.cel.split(' ').join('');

      // evitar email duplicado en db
      const emailExists = await this.userRepository.findEmail(body.email);
      if (emailExists) {
         throw new Errors('Email exists or is in use', 409);
      }

      body.cel = celWithoutSpaces;
      body.password = hashedPassword;

      let data = {
         id: crypto.randomUUID(),
         ...body,
      };

      const user = await this.userRepository.createNewUser(data);
      await AuthService.createAuthUser(user, data.password);

      return user;
   }

   async patchUser(id: UserDto['id'], body: UserUpdateDto): Promise<UserDto[]> {
      // buscar id para saber si existe y poder actualizarlo
      const user = await this.userRepository.findId(id);
      if (user === false) {
         throw new Errors('User not found', 404);
      }

      // si encuentra el id hasear contrasena
      let hashedPassword;
      if (body.password) {
         hashedPassword = await hashPassword(body.password);
         body.password = hashedPassword;
      }
      // si vienen el cel quitar espacios
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

      // actualizar password en auth
      await AuthService.updateAuthUser(id, body);

      return await this.userRepository.updateUser(id, body);
   }

   async deleteUser(id: UserDto['id']): Promise<string> {
      const user = this.userRepository.findId(id);

      if (!user) {
         throw new Errors('User not found', 404);
      }

      await AuthService.deleteAuthUser(id);

      return this.userRepository.deleteUser(id);
   }
}
