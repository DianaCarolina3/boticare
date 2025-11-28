import { AuthRepository } from './auth.repository.js';
import type { AuthRegisterDto } from './auth.schema.js';
import { Errors } from '../../utils/errors.js';

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
