export class NotFoundError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

export class ForbiddenError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "ForbiddenError";
        this.statusCode = 403;
    }
}

export class ConflictError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "ConflictError";
        this.statusCode = 409;
    }
}

export class ValidationError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = 400;
    }
}

export class InternalServerError extends Error {
    statusCode: number;

    constructor(message = 'Internal Server Error') {
        super(message);
        this.name = "InternalServerError";
        this.statusCode = 500;
    }
}
