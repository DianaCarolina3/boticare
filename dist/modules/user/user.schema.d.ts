import * as z from 'zod';
import type { ZodUUID } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    lastname: z.ZodString;
    cel: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>;
    email: z.ZodEmail;
    ubication: z.ZodObject<{
        country: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodTransform<string, string>>;
        city: z.ZodString;
        zone: z.ZodString;
    }, z.core.$strip>;
    photo: z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodDefault<z.ZodURL>>;
}, z.core.$strip>;
export declare const IdSchema: ZodUUID;
export declare const NameAndLastnameSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    lastname: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UserSchemaToCreate: z.ZodObject<{
    name: z.ZodString;
    lastname: z.ZodString;
    email: z.ZodEmail;
    photo: z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodDefault<z.ZodURL>>;
    cel: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>;
    ubication: z.ZodObject<{
        country: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodTransform<string, string>>;
        city: z.ZodString;
        zone: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const UserSchemaToUpdate: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    lastname: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    photo: z.ZodOptional<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodDefault<z.ZodURL>>>;
    cel: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>;
    ubication: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        country: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodTransform<string, string>>>;
        city: z.ZodOptional<z.ZodString>;
        zone: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type UserType = z.infer<typeof UserSchema>;
export type UserTypeWithoutId = z.infer<typeof UserSchemaToCreate>;
export type UserTypeOptionalWithoutId = z.infer<typeof UserSchemaToUpdate>;
//# sourceMappingURL=user.schema.d.ts.map