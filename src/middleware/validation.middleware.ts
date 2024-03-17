import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { messages } from "../config/message";

export function validationMiddleware<T>(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: messages.VALIDATION_ERROR,
        errors: errors,
      });
    }

    req.body = dtoInstance;
    next();
  };
}
