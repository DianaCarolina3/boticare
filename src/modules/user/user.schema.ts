import * as z from 'zod';

// la valida, si es null o '' que la convierta a undefined
const photoSchemaUrl = z.preprocess(
   (value) => {
      if (value === '' || value === null) return undefined;
      return value;
   },
   z
      .url({
         error: 'Must be URL image or a secure version of HTTP',
         protocol: /^https$/,
      })
      .trim()
      .default('https://cdn-icons-png.flaticon.com/512/12225/12225881.png'),
);

export const userSchema = z.object({
   id: z.uuid(),
   // trim quita espacios en blanco al inicio y al final, no en el medio
   name: z.string().trim().min(2, 'Name is required'),
   lastname: z.string().trim().min(1, 'Lastname is required'),
   // puede aceptar string o number y si number lo pasa a string
   email: z.email().transform((value) => value.toLowerCase()),
   password: z.string({ error: 'Must be a string' }).trim().min(4, 'Required minimum 4 characters'),
   cel: z.union([z.string(), z.number()]).transform((value) => String(value).trim()),
   birthdate: z.iso.date(),
   photo: photoSchemaUrl,
});

export const idSchema = z.uuid();

// pick solo usa name y lastname del userSchema
export const nameAndLastnameSchema = userSchema.pick({
   name: true,
   lastname: true,
});

export const userCreateSchema = userSchema.omit({
   id: true,
});

export const userUpdateSchema = userSchema
   .omit({
      id: true,
   })
   .partial();

export type UserDto = z.infer<typeof userSchema>;

export type UserCreateDto = z.infer<typeof userCreateSchema>;

export type UserUpdateDto = z.infer<typeof userUpdateSchema>;

// parse = para validacion interna de datos, detiene ejecucion si error y lanza throw
// safeParse = para validar datos externos sin expulsion, maneja el error y devuelve objeto
