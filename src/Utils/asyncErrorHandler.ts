import {NextFunction, Request, Response} from "express";

export const asyncErrorHandler = (fn: any) => {
    return(req:Request,res:Response,next:NextFunction) => {
        fn(req, res, next).catch((err: any) => next(err)); // => next(err) pass error to global error middleware
    }
}
