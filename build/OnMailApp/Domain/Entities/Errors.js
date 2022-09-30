"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLimitRateExceeded = exports.UnathorizedError = exports.InsufficientPermisionError = exports.MultipleValidationDataError = exports.ValidationDataError = exports.ErrorBDEntityFound = exports.OfferStatusError = exports.ErrorPwdOrUserNotFound = exports.ErrorBDEntityNotFound = void 0;
class ErrorBDEntityNotFound extends Error {
    constructor(message, status = 404) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
    }
    statusCode() {
        return this.status;
    }
}
exports.ErrorBDEntityNotFound = ErrorBDEntityNotFound;
class ErrorPwdOrUserNotFound extends Error {
    constructor(message, status = 404) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
    }
    statusCode() {
        return this.status;
    }
}
exports.ErrorPwdOrUserNotFound = ErrorPwdOrUserNotFound;
class OfferStatusError extends Error {
    constructor(message, status = 400) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
    }
    statusCode() {
        return this.status;
    }
}
exports.OfferStatusError = OfferStatusError;
class ErrorBDEntityFound extends Error {
    constructor(message, status = 400) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
    }
    statusCode() {
        return this.status;
    }
}
exports.ErrorBDEntityFound = ErrorBDEntityFound;
class ValidationDataError extends Error {
    constructor(message, status = 400) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
    }
    statusCode() {
        return this.status;
    }
}
exports.ValidationDataError = ValidationDataError;
class MultipleValidationDataError extends Error {
    constructor(message, status = 400) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
    }
    statusCode() {
        return this.status;
    }
}
exports.MultipleValidationDataError = MultipleValidationDataError;
class InsufficientPermisionError extends Error {
    constructor(message, status = 403) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
    }
    statusCode() {
        return this.status;
    }
}
exports.InsufficientPermisionError = InsufficientPermisionError;
class UnathorizedError extends Error {
    constructor(message, status = 401) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
    }
    statusCode() {
        return this.status;
    }
}
exports.UnathorizedError = UnathorizedError;
class ErrorLimitRateExceeded extends Error {
    constructor(message, status = 429) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
    }
    statusCode() {
        return this.status;
    }
}
exports.ErrorLimitRateExceeded = ErrorLimitRateExceeded;
