import { Request, Response } from "express";
import { InformationService } from "../service/information.service";
import { ProcessError } from "../helper/Error/errorHandler";
import { ResponseApi } from "../helper/interface/response.interface";
import Banners from "../database/models/banners.model";
import { messages } from "../config/message";

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
}
