import { prisma } from '../../core/config/database.js';
import { BaseRepository } from '../../shared/repositories/BaseRepository.js';
import type { AuthResponseLoginDto } from './auth.schema.js';
import { RoleName } from '@prisma/client';

export class AuthRepository extends BaseRepository<AuthResponseLoginDto> {
   constructor() {
      super(prisma, prisma.auth);
   }

   async defineRoleUser() {
      return this.prisma.role.findUnique({
         where: {
            name: RoleName.USER,
         },
      });
   }

   async findRegisterByEmail(email: string) {
      return this.prisma.auth.findFirst({
         where: {
            user: {
               email: email,
            },
         },
         include: {
            role: true,
            user: true,
         },
      });
   }

   async updateLastLogin(idAuth: string) {
      await this.prisma.auth.update({
         where: {
            id: idAuth,
         },
         data: { lastLogin: new Date().toISOString() },
      });
   }

   //
   // static async updateAuthUser(idUser: UserDto['id'], password: UserDto['password']) {
   //    const query = `UPDATE auth SET password=$1 WHERE user_id=$2`;
   //    const values = [password, idUser];
   //
   //    const { rowCount } = await pool.query(query, values);
   //    if (rowCount != 1) {
   //       throw new Errors('Error updating user', 500);
   //    }
   // }
}
