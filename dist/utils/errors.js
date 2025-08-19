export function handleError(err) {
    if (err instanceof Error) {
        if (err.message === 'User not found') {
            return { message: err.message, code: 404 };
        }
        if (err.message === 'Users not found') {
            return { message: err.message, code: 404 };
        }
        if (err.message === 'Email existed') {
            return { message: err.message, code: 409 };
        }
        return { message: err.message, code: 500 };
    }
    else {
        return { message: String(err), code: 500 };
    }
}
//# sourceMappingURL=errors.js.map