import { NextFunction, Request, Response } from 'express';

type Controller = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<Response<any> | void>;

export { Controller };
