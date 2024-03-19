import { Response } from "express";
import { BadRequestException } from "./BadRequestException/BadRequestException";
import { HttpStatusCode } from "axios";
import { ForbiddenException } from "./Forbidden/ForbiddenException";
import { UnauthorizedException } from "./UnauthorizedException/UnauthorizedException";
import { UnprocessableEntityException } from "./UnprocessableEntity/UnprocessableEntityException";
import { NotFoundException } from "./NotFound/NotFoundException";

export function ProcessError(err: any, res: Response) {
  console.error(err);
  if (err instanceof BadRequestException) {
    res.status(HttpStatusCode.BadRequest).json({
      status: err.errors.status,
      message: err.message,
      data: null,
    });
  } else if (err instanceof NotFoundException) {
    res.status(HttpStatusCode.NotFound).json({
      status: HttpStatusCode.NotFound,
      message: err.message,
      data:null
    });
  } else if (err instanceof ForbiddenException) {
    res.status(HttpStatusCode.Forbidden).json({
      status: HttpStatusCode.Forbidden,
      message: err.message,
      data:null
    });
  } else if (err instanceof UnauthorizedException) {
    res.status(HttpStatusCode.Unauthorized).json({
      status: err.errors.status,
      message: err.message,
      data:null
    });
  } else if (err instanceof UnprocessableEntityException) {
    res.status(HttpStatusCode.UnprocessableEntity).json({
      status: HttpStatusCode.UnprocessableEntity,
      message: err.message,
      data:null
    });
  } else {
    res.status(HttpStatusCode.InternalServerError).json({
      status: HttpStatusCode.InternalServerError,
      message: err.message ?? "Internal Server Error",
    });
  }
}
