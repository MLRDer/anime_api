class AppError extends Error {
    constructor(statusCode, message, send = true) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = true;
        this.send = send;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
