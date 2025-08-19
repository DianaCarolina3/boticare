import * as z from 'zod';
import { UserService } from './user.service.js';
import { IdSchema, NameAndLastnameSchema, UserSchemaToCreate, UserSchemaToUpdate } from './user.schema.js';
import { handleError } from "../../utils/errors.js";
export class UserController {
    static getAllOrByNameAndLastname = (
    //params url, res body, req body, req query
    _req, res) => {
        try {
            // Get all
            if (!_req.query.name && !_req.query.lastname) {
                const users = UserService.getAllUsers();
                return res.status(200).json(users);
            }
            // Validar name y lastname
            const nameAndLastnameValidation = NameAndLastnameSchema.safeParse(_req.query);
            if (!nameAndLastnameValidation.success) {
                const errorMessage = z.treeifyError(nameAndLastnameValidation.error);
                return res.status(422).json({ error: errorMessage.errors[0] });
            }
            // Get a filter query for name or/and lastname
            const { name, lastname } = nameAndLastnameValidation.data;
            const users = UserService.getByNameAndLastname(name, lastname);
            return res.status(200).json(users);
        }
        catch (err) {
            const error = handleError(err);
            return res.status(error.code).json({ error: error.message });
        }
    };
    static getById = (_req, res) => {
        try {
            const { id } = _req.params;
            const idValidation = IdSchema.safeParse(id);
            if (!idValidation.success) {
                const errorMessage = z.treeifyError(idValidation.error);
                return res.status(422).json({ error: errorMessage.errors[0] });
            }
            const user = UserService.getByIdUser(idValidation.data);
            return res.status(200).json(user);
        }
        catch (err) {
            const error = handleError(err);
            return res.status(error.code).json({ error: error.message });
        }
    };
    static postNewUser = (_req, res) => {
        try {
            // validar body
            const bodyValidation = UserSchemaToCreate.safeParse(_req.body);
            if (!bodyValidation.success) {
                // 422 request funciona, pero la sintaxis del recurso no es correcta
                const errorMessage = z.flattenError(bodyValidation.error);
                return res.status(422).json({ error: errorMessage.fieldErrors });
            }
            const newUser = UserService.postNewUser(bodyValidation.data);
            return res.status(200).json(newUser);
        }
        catch (err) {
            const error = handleError(err);
            return res.status(error.code).json({ error: error.message });
        }
    };
    static patchUser = (_req, res) => {
        // Record<K, T> objeto clave, valor
        try {
            const { id } = _req.params;
            // validar id
            const idValidation = IdSchema.safeParse(id);
            if (!idValidation.success) {
                const errorMessage = z.treeifyError(idValidation.error);
                return res.status(422).json({ error: errorMessage.errors[0] });
            }
            // validar body
            const bodyValidation = UserSchemaToUpdate.safeParse(_req.body);
            if (!bodyValidation.success) {
                const errorMessage = z.flattenError(bodyValidation.error);
                return res.status(422).json({ error: errorMessage.fieldErrors });
            }
            const updatedUser = UserService.patchUser(idValidation.data, bodyValidation.data);
            return res.status(200).json(updatedUser);
        }
        catch (err) {
            const error = handleError(err);
            return res.status(error.code).json({ error: error.message });
        }
    };
    static deleteUser = (_req, res) => {
        try {
            const { id } = _req.params;
            const idValidation = IdSchema.safeParse(id);
            if (!idValidation.success) {
                const errorMessage = z.treeifyError(idValidation.error);
                return res.status(422).json({ error: errorMessage.errors[0] });
            }
            const userDeleted = UserService.deleteUser(idValidation.data);
            return res.status(200).json(userDeleted);
        }
        catch (err) {
            const error = handleError(err);
            return res.status(error.code).json({ error: error.message });
        }
    };
}
//# sourceMappingURL=user.controller.js.map