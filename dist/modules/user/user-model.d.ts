import { type UserType, type UserTypeOptionalWithoutId, type UserTypeWithoutId } from "./user-schema.js";
export declare class UserModel {
    static find(): UserType[];
    static findId(id: UserType['id']): UserType | undefined;
    static findNameAndLastname(name?: string, lastname?: string): UserType[];
    static findEmail(email: string | undefined): string | undefined;
    static createNewUser(body: UserTypeWithoutId): UserType;
    static updateUser(id: UserType['id'], body: UserTypeOptionalWithoutId): UserType;
    static deleteUser(id: UserType['id']): string;
}
//# sourceMappingURL=user-model.d.ts.map