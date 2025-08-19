//Define y accede a los datos (BD) -> DB
import users from '../../test/user.json' with { type: 'json' }
import {UserSchema,
    type UserType,
    type UserTypeOptionalWithoutId,
    type UserTypeWithoutId} from "./user.schema.js";

// por archivo json validamos datos (en local)
// con db lista debe enviarse a la db y solo se valida en el controller el post y put
const userValidatedIntern: UserType[] = users.map(user => UserSchema.parse(user))

export class UserModel {

    static find(): UserType[] {
        return userValidatedIntern
    }

    static findId(id: UserType['id']): UserType | undefined {
        return userValidatedIntern.find((user) => String(user.id) === String(id))
    }

    static findNameAndLastname(name?: string, lastname?: string): UserType[] {
        if (name && lastname) {
            return userValidatedIntern.filter(
                user =>
                    user.name.toLowerCase() === name.toLowerCase() && user.lastname.toLowerCase() === lastname.toLowerCase()

            )
        }

        if (name) {
            return userValidatedIntern.filter(
                user => user.name.toLowerCase() === name?.toLocaleLowerCase()
            )
        }

        if (lastname) {
            return  userValidatedIntern.filter(
                user => user.lastname.toLowerCase() === lastname?.toLowerCase()
            )
        }

        return userValidatedIntern

    }

    static findEmail(email: string | undefined): string | undefined {
        const result = userValidatedIntern.find(
            user => user.email?.toLowerCase() === email?.toLocaleLowerCase()
        )

        return result?.email

    }

    static createNewUser(body: UserTypeWithoutId): UserType {
        let newUser: UserType = {
            id: crypto.randomUUID(),
            ...body
        }

        userValidatedIntern.push(newUser)
        return newUser
    }

    static updateUser(id: UserType['id'], body: UserTypeOptionalWithoutId): UserType {
        // ignorar por ahora hasta db
        users[id] = {
            ...users[id],
            ...body
        }

        // ignorar por ahora hasta db
        return users[id]
    }

    static deleteUser(id: UserType['id']): string {
        const indexUser = userValidatedIntern.findIndex(user => user.id === id)

        userValidatedIntern.splice(indexUser, 1)
        return 'User deleted'
    }
}