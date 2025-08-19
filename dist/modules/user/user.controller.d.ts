import type { Request, Response } from 'express';
import { type UserType, type UserTypeOptionalWithoutId, type UserTypeWithoutId } from './user.schema.js';
export declare class UserController {
    static getAllOrByNameAndLastname: (_req: Request<{}, {}, {}, {
        name?: string;
        lastname?: string;
    }>, res: Response<UserType[] | {
        error: string | undefined;
    }>) => Response<{
        id: string;
        name: string;
        lastname: string;
        cel: string;
        email: string;
        ubication: {
            country: string;
            city: string;
            zone: string;
        };
        photo: string;
    }[] | {
        error: string | undefined;
    }, Record<string, any>>;
    static getById: (_req: Request<{
        id: UserType["id"];
    }>, res: Response<UserType | {
        error: string | undefined;
    }>) => Response<{
        id: string;
        name: string;
        lastname: string;
        cel: string;
        email: string;
        ubication: {
            country: string;
            city: string;
            zone: string;
        };
        photo: string;
    } | {
        error: string | undefined;
    }, Record<string, any>>;
    static postNewUser: (_req: Request<{}, {}, UserTypeWithoutId>, res: Response<UserType | {
        error: string | Record<string, string[]> | undefined;
    }>) => Response<{
        id: string;
        name: string;
        lastname: string;
        cel: string;
        email: string;
        ubication: {
            country: string;
            city: string;
            zone: string;
        };
        photo: string;
    } | {
        error: string | Record<string, string[]> | undefined;
    }, Record<string, any>>;
    static patchUser: (_req: Request<{
        id: UserType["id"];
    }, {}, UserTypeOptionalWithoutId>, res: Response<UserTypeOptionalWithoutId | {
        error: string | Record<string, string[]> | undefined;
    }>) => Response<{
        email?: string | undefined;
        photo?: string | undefined;
        name?: string | undefined;
        lastname?: string | undefined;
        cel?: string | undefined;
        ubication?: {
            country?: string | undefined;
            city?: string | undefined;
            zone?: string | undefined;
        } | undefined;
    } | {
        error: string | Record<string, string[]> | undefined;
    }, Record<string, any>>;
    static deleteUser: (_req: Request<{
        id: UserType["id"];
    }>, res: Response<string | {
        error: string | undefined;
    }>) => Response<string | {
        error: string | undefined;
    }, Record<string, any>>;
}
//# sourceMappingURL=user.controller.d.ts.map