import { HttpStatusCode } from "axios";
import { Request, Response } from "express";
import { messages } from "../config/message";

import { ProcessError } from "../helper/Error/errorHandler";
import { ResponseApi } from "../helper/interface/response.interface";
import { InformationService } from "../service/information.service";
import {
  IBanner,
  IService,
} from "../helper/interface/db/information.interface";

export class InformationController {
  informationService: InformationService;
  constructor() {
    this.informationService = new InformationService();
  }

  async getAllBanners(req: Request, res: Response<ResponseApi<IBanner[]>>) {
    try {
      const response = await this.informationService.getAllBanners();
      res.json({
        status: 0,
        message: messages.SUCCESS,
        data: response,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getAllServices(req: Request, res: Response<ResponseApi<IService[]>>) {
    try {
      const response = await this.informationService.getAllServices();
      res.status(HttpStatusCode.Ok).json({
        status: 0,
        message: messages.SUCCESS,
        data: response,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
