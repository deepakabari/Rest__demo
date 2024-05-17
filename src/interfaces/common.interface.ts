import { NextFunction, Request, Response } from 'express';

// Define a type 'Controller' that represents the structure of a controller function
type Controller = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<Response<any> | void>;

export { Controller };
