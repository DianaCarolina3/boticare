import argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
   return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      hashLength: 32,
      timeCost: 3,
      parallelism: 1,
   });
}

// export function comparePassword
export async function comparePassword(
   plainPassword: string,
   hashedPassword: string,
): Promise<boolean> {
   return await argon2.verify(hashedPassword, plainPassword);
}
