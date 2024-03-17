import { Request, Response } from "express";
import UserService from "../service/user.service";
import { HttpStatusCode } from "axios";
import { ProcessError } from "../helper/Error/errorHandler";
import { BadRequestException } from "../helper/Error/BadRequestException/BadRequestException";
import Users from "../database/models/user";
import { ResponseApi } from "../helper/interface/response.interface";
import { messages } from "../config/message";

export class UserController {
  userServices: UserService;

  constructor() {
    this.userServices = new UserService();
  }

  async create(req: Request, res: Response<ResponseApi<void>>) {
    try {
      const response = await this.userServices.create(req.body);
      res.json({
        statusCode: HttpStatusCode.Created,
        message: response,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async detail(req: Request, res: Response<ResponseApi<Users>>) {
    try {
      const id = parseInt(req.params.id);
      const response = await this.userServices.detail(id);
      res.json({
        statusCode: HttpStatusCode.Created,
        message: messages.SUCCESS,
        data:response
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
