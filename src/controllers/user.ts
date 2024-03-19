import { HttpStatusCode } from "axios";
import { error } from "console";
import { Request, Response } from "express";

import { messages } from "../config/message";
import { ProcessError } from "../helper/Error/errorHandler";
import { IDetailUser, IUsers } from "../helper/interface/db/users.interface";
import { ResponseApi } from "../helper/interface/response.interface";
import UserService from "../service/user.service";

export class UserController {
  userServices: UserService;

  constructor() {
    this.userServices = new UserService();
  }

  async create(req: Request, res: Response<ResponseApi<null>>) {
    try {
      await this.userServices.create(req.body);
      res.json({
        status: 0,
        message: messages.SUCCESS_REGISTRATION,
        data: null,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async detail(req: Request, res: Response<ResponseApi<IUsers>>) {
    try {
      const response = await this.userServices.detail(req.user.id);
      res.json({
        status: 0,
        message: messages.SUCCESS,
        data: response,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async updateProfile(req: Request, res: Response<ResponseApi<IDetailUser>>) {
    try {
      const response = await this.userServices.updateProfileById(
        req.user.id,
        req.body
      );
      res.json({
        status: 0,
        message: messages.SUCCESS,
        data: response,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async updateImage(req: Request, res: Response) {
    const userId = req.user.id;
    const fileName = req.file?.filename;

    if (!fileName) throw error;
    const response = await this.userServices.updateImage(userId, req.file!);
    res.json({
      status: 0,
      message: messages.SUCCESS_UPDATE_IMAGE,
      data: response,
    });
  }
}
