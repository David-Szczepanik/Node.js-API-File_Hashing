"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorHandler = void 0;
const asyncErrorHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err)); // => next(err) pass error to global error middleware
    };
};
exports.asyncErrorHandler = asyncErrorHandler;
