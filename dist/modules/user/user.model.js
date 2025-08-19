//Define y accede a los datos (BD) -> DB
import users from '../../test/user.json' with { type: 'json' };
import { UserSchema } from "./user.schema.js";
// por archivo json validamos datos (en local)
// con db lista debe enviarse a la db y solo se valida en el controller el post y put
const userValidatedIntern = users.map(user => UserSchema.parse(user));
export class UserModel {
    static find() {
        return userValidatedIntern;
    }
    static findId(id) {
        return userValidatedIntern.find((user) => String(user.id) === String(id));
    }
    static findNameAndLastname(name, lastname) {
        if (name && lastname) {
            return userValidatedIntern.filter(user => user.name.toLowerCase() === name.toLowerCase() && user.lastname.toLowerCase() === lastname.toLowerCase());
        }
        if (name) {
            return userValidatedIntern.filter(user => user.name.toLowerCase() === name?.toLocaleLowerCase());
        }
        if (lastname) {
            return userValidatedIntern.filter(user => user.lastname.toLowerCase() === lastname?.toLowerCase());
        }
        return userValidatedIntern;
    }
    static findEmail(email) {
        const result = userValidatedIntern.find(user => user.email?.toLowerCase() === email?.toLocaleLowerCase());
        return result?.email;
    }
    static createNewUser(body) {
        let newUser = {
            id: crypto.randomUUID(),
            ...body
        };
        userValidatedIntern.push(newUser);
        return newUser;
    }
    static updateUser(id, body) {
        // ignorar por ahora hasta db
        users[id] = {
            ...users[id],
            ...body
        };
        // ignorar por ahora hasta db
        return users[id];
    }
    static deleteUser(id) {
        const indexUser = userValidatedIntern.findIndex(user => user.id === id);
        userValidatedIntern.splice(indexUser, 1);
        return 'User deleted';
    }
}
//# sourceMappingURL=user.model.js.map