import type { Request } from 'express';

// añadir campos request en express los añade para typescript
declare module 'express-serve-static-core' {
   interface Request<
      P = any,
      ResBody = any,
      ReqBody = any,
      ReqQuery = any,
      // res.locals es un objeto donde express deja guardar valores entre middlewares
      Locals extends Record<string, any> = Record<string, any>,
   > {
      validatedBody?: ReqBody;
      validatedQuery?: ReqQuery;
      validatedParams?: P;
      // user, para crear el req.user - user_id
   }
}
