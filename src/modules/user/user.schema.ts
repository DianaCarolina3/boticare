import * as z from 'zod'
import type { ZodUUID } from 'zod'

// ----- organizar depende del front
/*const photoSchemaImage = z.string().trim()*/

// si la photo no es undefined, la valida, entonces si es null o '' que la convierta a undefined
const photoSchemaUrl = z.preprocess((value) => {
    if (value === ''|| value === null) return undefined
    return value
}, z.url({ error: 'Must be URL image or a secure version of HTTP' , protocol: /^https$/ }).trim().default('https://cdn-icons-png.flaticon.com/512/12225/12225881.png'))

export const UserSchema = z.object({
    id: z.uuid(),
    // trim quita espacios en blanco al inicio y al final, no en el medio
    name: z.string().trim().min(2, 'Name is required'),
    lastname: z.string().trim().min(1, 'Lastname is required'),
    password: z.string({ error: 'Must be a string'}).trim().min(4, 'Required minimum 4 characters'),
    // puede aceptar string o number y lo pasa a string
    cel: z.union([z.string(), z.number()]).transform(
        value => String(value).trim()
    ),
    email: z.email().transform(value => value.toLowerCase()),
    photo: photoSchemaUrl
})

export const IdSchema: ZodUUID = z.uuid()

export const NameAndLastnameSchema = z.object({
    // quita espacios vacios del string al IyF, debe tener al menos 2 letras el nombre
    name: z.string().trim().min(2, 'Name is required').optional(),
    lastname: z.string().trim().min(1, 'lastname is required').optional()
})

export const UserSchemaToCreate = UserSchema.omit({
    id: true
})

export const UserSchemaToUpdate = UserSchema.omit({
    id: true,

}).partial()

export type UserType = z.infer<typeof UserSchema>

export type UserTypeWithoutId = z.infer<typeof UserSchemaToCreate>

export type UserTypeOptionalWithoutId = z.infer<typeof UserSchemaToUpdate>

// parse = para validacion interna de datos, detiene ejecucion si error y lanza throw
// safeParse = para validar datos externos sin expulsion, maneja el error y devuelve objeto
