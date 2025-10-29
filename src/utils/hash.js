import { hash } from 'bcrypt';
export async function hashPassword(password) {
    const saltRounds = 10;
    return await hash(password, saltRounds);
}
// export function comparePassword
//# sourceMappingURL=hash.js.map