import { Op } from "sequelize";
import InvoiceNo from "../database/models/invoiceNo.model";
import TransactionModel from "../database/models/transactions.model";
import Users from "../database/models/user";
import { ProcessError } from "../helper/Error/errorHandler";
import { ITransaction } from "../helper/interface/transaction/transaction.interface";
import UserService from "./user.service";
import { DateTime } from "luxon";

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
}
