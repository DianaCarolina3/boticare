import { AuthRepository } from './auth.repository.js';
import type { UserDto, UserUpdateDto } from '../user/user.schema.js';

export class AuthService {
   static async createAuthUser(data: UserDto, password: string): Promise<void> {
      let id = crypto.randomUUID();

      if (!data.id && password) {
         throw new Error('Id and password is required');
      }

      await AuthRepository.createAuthUser(id, data.id, password);
   }

   static async deleteAuthUser(idUser: UserDto['id']): Promise<void> {
      await AuthRepository.deleteAuthUser(idUser);
   }

   static async updateAuthUser(idUser: UserDto['id'], body: UserUpdateDto): Promise<void> {
      if (idUser && body.password) {
         await AuthRepository.updateAuthUser(idUser, body.password);
      }
   }
}
