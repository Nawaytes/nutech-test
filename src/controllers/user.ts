import { Request, Response } from "express";
import UserService from "../service/user.service";
import { HttpStatusCode } from "axios";
import { ProcessError } from "../helper/Error/errorHandler";
import { BadRequestException } from "../helper/Error/BadRequestException/BadRequestException";
import Users from "../database/models/user";

export class UserController {
  userServices: UserService;

  constructor() {
    this.userServices = new UserService();
  }


  async create(req: Request, res: Response) {
    try {
      const user = await this.userServices.create(req.body);
      res.json(user.toJSON());
    } catch (err) {
      ProcessError(err, res);
    }
  }

}
