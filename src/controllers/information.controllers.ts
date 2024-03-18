import { Request, Response } from "express";
import { InformationService } from "../service/information.service";
import { ProcessError } from "../helper/Error/errorHandler";
import { ResponseApi } from "../helper/interface/response.interface";
import Banners from "../database/models/banners.model";
import { messages } from "../config/message";
import Services from "../database/models/services.model";
import { HttpStatusCode } from "axios";

export class InformationController {
  informationService: InformationService;
  constructor() {
    this.informationService = new InformationService();
  }

  async getAllBanners(req: Request, res: Response<ResponseApi<Banners[]>>) {
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

  async getAllServices(req: Request, res: Response<ResponseApi<Services[]>>) {
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
