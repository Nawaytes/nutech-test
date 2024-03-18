import { Request, Response } from "express";
import { messages } from "../config/message";
import { ProcessError } from "../helper/Error/errorHandler";
import { ResponseApi } from "../helper/interface/response.interface";
import { AuthService } from "../service/auth.service";

export class AuthController {
  authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response<ResponseApi<any>>) {
    try {
      const response = await this.authService.login(req.body);
      res.json({
        status: 0,
        message: messages.SUCCESS_LOGIN,
        data: response,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
