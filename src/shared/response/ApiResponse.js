import { Errors } from "../../utils/errors.js";
export function success(_req, res, message, status) {
    let statusCode = status;
    let statusMessage = message;
    if (!statusCode) {
        statusCode = 200;
    }
    if (!message) {
        statusMessage = 'Ok';
    }
    res.status(statusCode).json({
        status: statusCode,
        body: statusMessage
    });
}
export function error(_req, res, message, status, errorStack) {
    let statusCode = status;
    let statusMessage = message;
    if (!statusCode) {
        statusCode = 500;
    }
    if (!message) {
        statusMessage = 'Client error';
    }
    if (statusCode >= 500) {
        res.status(statusCode).json({
            status: statusCode,
            body: statusMessage,
            error: errorStack
        });
    }
    else {
        res.status(statusCode).json({
            status: statusCode,
            body: statusMessage
        });
    }
}
export function handlerError(err, _req, res, _next) {
    error(_req, res, err.message, err.status, err.stack);
}
//# sourceMappingURL=ApiResponse.js.map