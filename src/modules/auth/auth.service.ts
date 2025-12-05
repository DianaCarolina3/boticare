import { AuthRepository } from './auth.repository.js';
import type { AuthRegisterDto } from './auth.schema.js';
import { Errors } from '../../utils/errors.js';
import { comparePassword, hashPassword } from '../../utils/hash.js';
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

   async updatePassword(userId: string, password: string) {
      // validar si la contrasena es nueva
      const auth = await this.authRepository.findPassword(userId);
      if (!auth) throw new Errors('User auth not found', 404);

      const isSame = await comparePassword(password, auth.password);
      if (isSame) throw new Errors('New password cannot be the same as the current password', 400);

      const hashedPassword = await hashPassword(password);

      await this.authRepository.updatePassword(userId, hashedPassword);
   }
}
