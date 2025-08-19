import * as z from 'zod';
// ----- organizar depende del frontend
/*const photoSchemaImage = z.string().trim()*/
// si la photo no es undefined, la valida, entonces si es null o '' que la convierta a undefined
const photoSchemaUrl = z.preprocess((value) => {
    if (value === '' || value === null)
        return undefined;
    return value;
}, z.url({ error: 'Must be URL image or a secure version of HTTP', protocol: /^https$/ }).trim().default('https://cdn-icons-png.flaticon.com/512/12225/12225881.png'));
export const UserSchema = z.object({
    id: z.uuid(),
    // trim quita espacios en blanco al inicio y al final, no en el medio
    name: z.string().trim().min(2, 'Name is required'),
    lastname: z.string().trim().min(1, 'Lastname is required'),
    // puede aceptar string o number y lo pasa a string
    cel: z.union([z.string(), z.number()]).transform(value => String(value).trim()),
    email: z.email(),
    ubication: z.object({
        // tranforma valores antes de validar
        // pasa a minusculas y luego válida que sea colombia
        country: z.string({ error: 'Must be a string' }).transform(value => value.trim().toLowerCase())
            .refine(value => value === 'colombia', {
            error: 'Must be only Colombia'
        }).transform(() => 'Colombia'),
        city: z.string({ error: 'City is required' }).trim().min(3, 'City is required'),
        zone: z.string({ error: 'Zone is required' }).trim(),
    }),
    photo: photoSchemaUrl
});
export const IdSchema = z.uuid();
export const NameAndLastnameSchema = z.object({
    // quita espacios vacios del string, debe tener al menos 2 letras el nombre
    name: z.string().trim().min(2, 'Name is required').optional(),
    lastname: z.string().trim().min(1, 'lastname is required').optional()
});
export const UserSchemaToCreate = UserSchema.omit({
    id: true
});
// partial pone todas las propiedades opcionales
// el address es opcional pero sus propiedades no y también queremos que lo sean
// extend agrega o sobre escribe las propiedades
export const UserSchemaToUpdate = UserSchema.omit({
    id: true
}).extend({
    // shape permite acceder a los objetos internos, este caso de address
    // parcial hace que las propiedades del objeto sean opcionales, pero no el objecto
    // opcional hace que pueda omitirse el address el objeto
    ubication: UserSchema.shape.ubication.partial().optional()
}).partial();
// parse = para validacion interna de datos, detiene ejecucion si error y lanza throw
// safeParse = para validar datos externos sin expulsion, maneja el error y devuelve objeto
//# sourceMappingURL=user.schema.js.map