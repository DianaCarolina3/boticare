import type { UserType, UserTypeOptionalWithoutId, UserTypeWithoutId } from "./user.schema.js";
export declare class UserService {
    static getAllUsers(): UserType[];
    static getByIdUser(id: UserType['id']): UserType | undefined;
    static getByNameAndLastname(name?: UserType['name'], lastname?: UserType['lastname']): UserType[];
    static postNewUser(body: UserTypeWithoutId): UserType;
    static patchUser(id: UserType['id'], body: UserTypeOptionalWithoutId): UserType;
    static deleteUser(id: UserType['id']): string;
}
//# sourceMappingURL=user.service.d.ts.map