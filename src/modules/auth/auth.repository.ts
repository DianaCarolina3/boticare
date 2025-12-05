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

   async findPassword(userId: string) {
      return this.prisma.auth.findUnique({
         where: {
            userId: userId,
         },
         select: {
            password: true,
         },
      });
   }

   async updatePassword(userId: string, password: string) {
      await this.prisma.auth.update({
         where: {
            userId,
         },
         data: {
            password: password,
         },
      });
   }
}
