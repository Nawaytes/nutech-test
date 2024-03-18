import { HttpStatusCode } from "axios";
import { Request, Response } from "express";
import { messages } from "../config/message";
import { BadRequestException } from "../helper/Error/BadRequestException/BadRequestException";
import { ProcessError } from "../helper/Error/errorHandler";
import { ResponseApi } from "../helper/interface/response.interface";
import { TransactionService } from "../service/transaction.service";

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

  async topup(req: Request, res: Response<ResponseApi<any>>) {
    try {
      const userId = req.user.id;
      if (
        !req.body.top_up_amount ||
        typeof req.body.top_up_amount !== "number" ||
        req.body.top_up_amount < 0
      ) {
        throw new BadRequestException(messages.BAD_REQUEST_TOP_UP, 102);
      }

      const balance = await this.trxService.topup(
        userId,
        req.body.top_up_amount
      );

      res.status(HttpStatusCode.Ok).json({
        status: 0,
        message: messages.SUCCESS_TOP_UP_BALANCE,
        data: balance,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async transaction(req: Request, res: Response<ResponseApi<any>>) {
    try {
      const body = req.body;
      const response = await this.trxService.transaction(req.user.id, body);

      res.status(HttpStatusCode.Ok).json({
        status: 0,
        message: messages.SUCCESS_TRANSACTION,
        data: response,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async page(req: Request, res: Response) {
    try {
      const offset = parseInt((req.query.offset as string) ?? "1");
      const limit = parseInt((req.query.limit as string) ?? "5");
      const userId = req.user.id;
      const response = await this.trxService.page(userId, offset, limit);
      res.status(HttpStatusCode.Ok).json({
        status: 0,
        messages: messages.SUCCESS,
        data: response,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
