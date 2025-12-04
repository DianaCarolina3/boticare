import { z } from 'zod';

export const authSchema = z.object({
   id: z.uuid(),
   userId: z.uuid(),
   email: z.email().transform((value) => value.toLowerCase()),
   password: z.string({ error: 'Must be a string' }).trim().min(4, 'Required minimum 4 characters'),
   roleId: z.uuid().optional(),
   lastLogin: z.date().nullable(),
   createdAt: z.date(),
});

// login
export const authLoginSchema = authSchema.pick({
   email: true,
   password: true,
});
export type AuthLoginDto = z.infer<typeof authLoginSchema>;

// register
export const authRegisterSchema = authSchema.pick({
   password: true,
   userId: true,
   roleId: true,
});
export type AuthRegisterDto = z.infer<typeof authRegisterSchema>;

// response
export const authResponseLoginSchema = z.object({
   message: z.string(),
   accessToken: z.string(),
   user: z.object({
      id: z.string(),
      role: z.string(),
   }),
});
export type AuthResponseLoginDto = z.infer<typeof authResponseLoginSchema>;
