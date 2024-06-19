import {NextFunction, Request, Response} from "express";

/**
 * Wraps an asynchronous function in a try-catch block and passes any errors to the next middleware function.
 * If the asynchronous function throws an error, it is caught and passed to the next middleware function.
 * @param {Function} fn - The asynchronous function to wrap.
 * @returns {Function} A new function that wraps the asynchronous function in a try-catch block.
 */
export const asyncErrorHandler = (fn: any) => {
    return(req:Request,res:Response,next:NextFunction) => {
        fn(req, res, next).catch((err: any) => next(err)); // => next(err) pass error to global error middleware
    }
}
