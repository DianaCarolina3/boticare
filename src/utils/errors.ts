export function handleError(err: string | unknown) {
   if (err instanceof Error) {
       if (err.message === 'User not found') {
           return { message: err.message , code: 404 }
       }
       if (err.message === 'Users not found') {
           return { message: err.message , code: 404 }
       }
       if (err.message === 'Email exists or is in use') {
           return { message: err.message, code: 409 }
       }
       return { code: 500, message: err.message, stack: err.stack }
   } else {
       return { message: String(err), code: 500 }
   }

}