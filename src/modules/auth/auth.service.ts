import { AuthRepository } from './auth.repository.js';
import type { AuthRegisterDto } from './auth.schema.js';
import { Errors } from '../../utils/errors.js';
import { comparePassword } from '../../utils/hash.js';

export class AuthService {
   constructor(private readonly authRepository: AuthRepository) {}

   async register(data: AuthRegisterDto) {
      const { password, userId, roleId } = data;

      if (!userId && !password) {
         throw new Error('Id and password is required');
      }

      let roleIdToUse = roleId;
      // si no viene un rol definido
      if (!roleIdToUse) {
         // entonces definir rol
         const defaultRole = await this.authRepository.defineRoleUser();
         if (!defaultRole) {
            throw new Errors('Default role not found');
         }
         roleIdToUse = defaultRole.id;
      }

      const dataAuth = {
         password,
         userId,
         roleId: roleIdToUse,
      };

      await this.authRepository.create(dataAuth);
   }

   async login(email: string, password: string) {
      // verificar si email existe
      const registerAuth = await this.authRepository.findRegisterByEmail(email);
      if (!registerAuth) {
         throw new Errors('Invalid email or password', 401);
      }

      // comparar contraseña
      const idValidPassword = await comparePassword(password, registerAuth.password);
      if (!idValidPassword) {
         throw new Errors('Invalid email or password', 401);
      }

      // generar token

      // actualizar el lastLogin
      await this.authRepository.updateLastLogin(registerAuth.id);

      console.log(registerAuth);
   }

   //  async deleteAuthUser(idUser: UserDto['id']): Promise<void> {
   //    await AuthRepository.deleteAuthUser(idUser);
   // }
   //
   //  async updateAuthUser(idUser: UserDto['id'], body: UserUpdateDto): Promise<void> {
   //    if (idUser && body.password) {
   //       await AuthRepository.updateAuthUser(idUser, body.password);
   //    }
   // }
}
