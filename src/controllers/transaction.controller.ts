import { Request, Response } from "express";
import { TransactionService } from "../service/transaction.service";
import { ProcessError } from "../helper/Error/errorHandler";
import { ResponseApi } from "../helper/interface/response.interface";
import { HttpStatusCode } from "axios";
import { messages } from "../config/message";

export class TransactionController {
  trxService: TransactionService;

  constructor() {
    this.trxService = new TransactionService();
  }

  async getBalance(req: Request, res: Response<ResponseApi<any>>) {
    try {
      const userId = req.user.id;
      const balance = await this.trxService.getBalance(userId);
      res.status(HttpStatusCode.Ok).json({
        status: 0,
        message: messages.SUCCESS_GET_BALANCE,
        data: {
          balance,
        },
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
