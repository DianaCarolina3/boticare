//Define y accede a los datos (BD) -> DB
import type { UserDto, UserResponseDto, UserUpdateDto } from './user.schema.js';
import { BaseRepository } from '../../shared/repositories/BaseRepository.js';
import { prisma } from '../../core/config/database.js';

export class UserRepository extends BaseRepository<UserResponseDto> {
   constructor() {
      super(prisma, prisma.user);
   }

   async findNameAndLastname(name?: string, lastname?: string): Promise<UserResponseDto[]> {
      const where: any = {};

      if (name) {
         where.name = { contains: name };
      }
      if (lastname) {
         where.lastname = { contains: lastname };
      }

      const users = await this.modelDelegate.findMany({
         where,
      });
      if (!users || users.length === 0) {
         return this.findAll();
      }

      return users;
   }

   async findEmail(email: string | undefined): Promise<boolean | null> {
      if (!email) return null;

      const user = await this.modelDelegate.findUnique({
         where: { email: email },
         select: { id: true },
      });

      return user ? true : false;
   }

   async updateUser(id: UserDto['id'], body: UserUpdateDto): Promise<UserResponseDto> {
      return await this.modelDelegate.update({
         where: { id },
         data: body,
      });
   }
}
