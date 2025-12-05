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

   console.log('Roles created correctly');

   // Crear categorias si no existen
   const categories = [
      { name: 'Desayuno' },
      { name: 'Almuerzo' },
      { name: 'Cena' },
      { name: 'Postres' },
      { name: 'Ensaladas' },
      { name: 'Bebidas' },
      { name: 'Sopas' },
      { name: 'Carnes' },
      { name: 'Vegetariano' },
      { name: 'Vegano' },
      { name: 'Comida Rápida' },
      { name: 'Refrigerio' },
   ];
   await Promise.all(
      categories.map((category) =>
         prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
         }),
      ),
   );

   console.log('Categories created correctly');
}

main()
   .then(() => process.exit(0))
   .catch((e) => {
      console.error(e);
      process.exit(1);
   });
