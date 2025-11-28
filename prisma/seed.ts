import { prisma } from '../src/core/config/database.js';
import { RoleName } from '@prisma/client';

async function main() {
   // Crear roles si no existen
   await prisma.role.upsert({
      where: { name: RoleName.USER },
      update: {},
      create: { name: RoleName.USER },
   });

   await prisma.role.upsert({
      where: { name: RoleName.ADMIN },
      update: {},
      create: { name: RoleName.ADMIN },
   });

   console.log('Roles creados correctamente');
}

main()
   .then(() => process.exit(0))
   .catch((e) => {
      console.error(e);
      process.exit(1);
   });
