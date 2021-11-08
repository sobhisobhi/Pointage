const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
    let error = {
        ...err,
    };

    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = [];
        Object.values(err.errors).forEach((errr) => {
            message.push({
                field: errr.properties.path,
                message: errr.message,
            });
        });
        error = new ErrorResponse(null, 400, message);
    }

    return next(
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.messageWithField || error.message || "Server Error",
        })
    );
};

module.exports = errorHandler;
