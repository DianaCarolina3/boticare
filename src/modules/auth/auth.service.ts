import { AuthRepository } from './auth.repository.js';
import type { AuthRegisterDto } from './auth.schema.js';
import { Errors } from '../../utils/errors.js';
import { comparePassword } from '../../utils/hash.js';
import { signToken } from '../../utils/jwt.js';

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
      const validPassword = await comparePassword(password, registerAuth.password);
      if (!validPassword) {
         throw new Errors('Invalid email or password', 401);
      }

      // actualizar el lastLogin
      await this.authRepository.updateLastLogin(registerAuth.id);

      // generar token, enviar id de user y role
      const token = signToken(registerAuth.user.id, registerAuth.role.name);

      return {
         message: 'Login successful',
         accessToken: token,
         user: {
            id: registerAuth.user.id,
            role: registerAuth.role.name,
         },
      };
   }

   //  async updateAuthUser(idUser: UserDto['id'], body: UserUpdateDto): Promise<void> {
   //    if (idUser && body.password) {
   //       await AuthRepository.updateAuthUser(idUser, body.password);
   //    }
   // }
}
