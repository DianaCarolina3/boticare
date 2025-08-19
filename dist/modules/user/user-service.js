// Implementa la lógica de negocio -> Model
import { UserModel } from './user-model.js';
import users from '../../user.json' with { type: 'json' };
export class UserService {
    static getAllUsers() {
        return UserModel.find();
    }
    static getByIdUser(id) {
        const user = UserModel.findId(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    static getByNameAndLastname(name, lastname) {
        const users = UserModel.findNameAndLastname(name, lastname);
        if (!users || users.length === 0) {
            throw new Error('Users not found');
        }
        return users;
    }
    static postNewUser(body) {
        // evitar email duplicado en db
        const emailExists = UserModel.findEmail(body.email);
        if (emailExists) {
            throw new Error('Email existed');
        }
        return UserModel.createNewUser(body);
    }
    static patchUser(id, body) {
        const indexUser = users.findIndex(item => item.id === id);
        if (indexUser === -1) {
            throw new Error('User not found');
        }
        // ignorar por ahora hasta db
        return UserModel.updateUser(indexUser, body);
    }
    static deleteUser(id) {
        const user = UserModel.findId(id);
        if (!user) {
            throw new Error('User not found');
        }
        return UserModel.deleteUser(id);
    }
}
//# sourceMappingURL=user-service.js.map