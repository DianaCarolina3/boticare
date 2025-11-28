/*
limpia objeto el body,
removiendo propiedades null, undefined y string vacios

Ya que cuando hay un campo null prisma sobreescribe, no hace coalesce
 */

// coalesce: toma el primer valor no nulo, si es nulo, deja el actual de la db

export const cleanObject = (data: Record<string, any>) => {
   const cleaned: Record<string, any> = {};

   for (const [key, value] of Object.entries(data)) {
      if (
         value === null ||
         value === undefined ||
         (typeof value === 'string' && value.trim() === '')
      ) {
         continue;
      }

      cleaned[key] = value;
   }

   return cleaned;
};
