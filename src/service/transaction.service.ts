import { DateTime } from "luxon";
import { Op } from "sequelize";
import { messages } from "../config/message";
import InvoiceNo from "../database/models/invoiceNo.model";
import Services from "../database/models/services.model";
import TransactionModel from "../database/models/transactions.model";
import { TransactionDto } from "../dto/transaction.dto";
import { BadRequestException } from "../helper/Error/BadRequestException/BadRequestException";
import { IPaginate } from "../helper/interface/paginate/paginate.interface";
import { ITransaction } from "../helper/interface/transaction/transaction.interface";
import UserService from "./user.service";

export class TransactionService {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }
  async getBalance(userId: number): Promise<number> {
    try {
      const user = await this.userService.getById(userId);
      return parseInt(user.balance as unknown as string);
    } catch (error) {
      throw error;
    }
  }

  async topup(userId: number, topUpAmount: any): Promise<number> {
    try {
      const user = await this.userService.getById(userId);
      const newBalance: number =
        parseInt(user.balance as unknown as string) + topUpAmount;
      const newData = await this.userService.updateById(userId, {
        balance: newBalance,
      });

      await this.recordTransaction({
        serviceCode: "TOPUP",
        serviceName: "Top Up balance",
        totalAmount: topUpAmount,
        transactionType: "TOPUP",
        userId,
      });
      return parseInt(newData.balance as unknown as string);
    } catch (error) {
      throw error;
    }
  }

  async transaction(userId: number, input: TransactionDto) {
    try {
      const service = await Services.findOne({
        where: {
          serviceCode: input.service_code,
        },
      });

      const user = await this.userService.getById(userId);

      if (!service) {
        throw new BadRequestException(messages.SERVICE_NOT_FOUND, 102);
      }
      const balance = parseInt(user.balance as unknown as string);
      const tarif = parseInt(service.serviceTariff as unknown as string);
      if (balance < tarif) {
        throw new BadRequestException(messages.BALACE_NOT_ENOUGH, 102);
      }
      const newBalance = balance - tarif;
      const transaction = await this.recordTransaction({
        serviceCode: service.serviceCode,
        serviceName: service.serviceName,
        totalAmount: service.serviceTariff,
        transactionType: "PAYMENT",
        userId,
      });

      await this.userService.updateById(userId, {
        balance: newBalance,
      });

      return {
        invoice_number: transaction.invoiceNumber,
        service_code: transaction.serviceCode,
        service_name: transaction.serviceName,
        transaction_type: transaction.transactionType,
        total_amount: transaction.totalAmount,
        created_on: transaction.createdAt,
      };
    } catch (error) {
      throw error;
    }
  }

  async recordTransaction(input: ITransaction): Promise<TransactionModel> {
    try {
      const record = await TransactionModel.create({
        ...input,
        invoiceNumber: await this.generateInvoiceNo(),
      });
      return record;
    } catch (error) {
      throw error;
    }
  }

  async generateInvoiceNo(): Promise<string> {
    try {
      await InvoiceNo.create();
      const startOfDay = DateTime.local().startOf("day").toJSDate();
      const endOfDay = DateTime.local().endOf("day").toJSDate();

      const { count } = await InvoiceNo.findAndCountAll({
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      });
      return `INV${DateTime.local().toFormat("ddLLyyyy")}-${count
        .toString()
        .padStart(3, "0")}`;
    } catch (error) {
      throw error;
    }
  }

  async page(
    userId: number,
    offset: number,
    limit: number
  ): Promise<IPaginate<any[]>> {
    try {
      const transactions = await TransactionModel.paginate({
        page: offset,
        limit: limit,
        searchConditions: [
          {
            keySearch: "userId",
            keyValue: userId,
            operator: Op.eq,
          },
        ],
        attributes: [
          "invoice_number",
          "transaction_type",
          "service_name",
          "total_amount",
          "created_at",
        ],
      });
      const record = transactions.data.map((value: TransactionModel) => {
        const valueJson: any = value.toJSON();

        return {
          invoice_number: valueJson.invoice_number,
          transaction_type: valueJson.transaction_type,
          description: valueJson.service_name,
          total_amount: valueJson.total_amount,
          created_on: valueJson.created_at,
        };
      });
      return {
        limit,
        offset,
        records: record,
      };
    } catch (error) {
      throw error;
    }
  }
}
