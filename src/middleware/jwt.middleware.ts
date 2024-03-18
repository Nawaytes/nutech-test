import { NextFunction, Request, Response } from "express";
import { ResponseApi } from "../helper/interface/response.interface";
import { HttpStatusCode } from "axios";
import { messages } from "../config/message";
import jwt from "jsonwebtoken";
import configConstants from "../config/constants";

export function jwtMiddleware() {
  return async (
    req: Request,
    res: Response<ResponseApi<null>>,
    next: NextFunction
  ) => {
    try {
      if (!req.headers["authorization"]) {
        throw new Error();
      }

      const buffer = req.headers["authorization"].split(" ");
      const token = buffer[1];
      if (buffer[0] != "Bearer" && !token) {
        throw new Error();
      }
      jwt.verify(token, configConstants.JWT_SECRET_ACCESS_TOKEN);
      req.user = jwt.decode(token);
      next();
    } catch (error) {
      return res.status(HttpStatusCode.Unauthorized).json({
        status: 102,
        message: messages.UNAUTHORIZED,
        data: null,
      });
    }
  };
}
