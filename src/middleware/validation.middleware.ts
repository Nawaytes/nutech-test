import { HttpStatusCode } from "axios";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { messages } from "../config/message";
import { ResponseApi } from "../helper/interface/response.interface";

export function validationMiddleware(dtoClass: any) {
  return async (
    req: Request,
    res: Response<ResponseApi<null>>,
    next: NextFunction
  ) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: 102,
        message: messages.VALIDATION_ERROR,
        data: null,
      });
    }

    req.body = dtoInstance;
    next();
  };
}
