export function notFound(req, res, next) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}
export function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
    next();
}
export function handleErrorService(error) {
    let statusCode = 500;
    let message = 'Internal Server Error';
    if (error instanceof Error) {
        if (error.name === 'ValidationError') {
            statusCode = 400;
            message = error.message;
        }
        else if (error.name === 'UnauthorizedError') {
            statusCode = 401;
            message = 'Unauthorized';
        }
        else if (error.name === 'NotFoundError') {
            statusCode = 404;
            message = 'Resource not found';
        }
        console.error(error);
    }
    const customError = new Error(message);
    customError.statusCode = statusCode;
    return customError;
}
