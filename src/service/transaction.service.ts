import { DateTime } from "luxon";
import { Op } from "sequelize";
import { messages } from "../config/message";
import Services from "../database/models/services.model";
import TransactionModel from "../database/models/transactions.model";
import { TransactionDto } from "../dto/transaction.dto";
import { BadRequestException } from "../helper/Error/BadRequestException/BadRequestException";
import { ITransaction } from "../helper/interface/db/transaction.interface";
import { IPaginate } from "../helper/interface/paginate/paginate.interface";
import { IInputTransaction } from "../helper/interface/transaction/transaction.interface";
import Database from "./mysql.service";
import UserService from "./user.service";

export class TransactionService {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }
  async getBalance(userId: number): Promise<number> {
    try {
      const user = await this.userService.getById(userId);
      return parseInt(user.balance);
    } catch (error) {
      throw error;
    }
  }

  async topup(userId: number, topUpAmount: number): Promise<number> {
    try {
      const user = await this.userService.getById(userId);
      const newBalance: number = parseInt(user.balance) + topUpAmount;

      await Database.connect();
      await Database.connection.execute(
        "UPDATE users SET balance = ? WHERE id = ?",
        [newBalance, userId]
      );
      await Database.disconnect();
      const users = await this.userService.getById(userId);

      await this.recordTransaction({
        serviceCode: "TOPUP",
        serviceName: "Top Up balance",
        totalAmount: topUpAmount,
        transactionType: "TOPUP",
        userId,
      });
      return parseInt(users.balance);
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

      return {
        invoice_number: transaction.invoice_number,
        service_code: transaction.service_code,
        service_name: transaction.service_name,
        transaction_type: transaction.transaction_type,
        total_amount: transaction.total_amount,
        created_on: transaction.created_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async recordTransaction(input: IInputTransaction): Promise<ITransaction> {
    try {
      const invoiceNumber = await this.generateInvoiceNo();
      await Database.connect();
      const query = `INSERT INTO 
        transactions 
        (
          invoice_number, 
          service_code, 
          service_name, 
          transaction_type, 
          total_amount,
          user_id
        ) VALUES
        (
          ?,?,?,?,?,?
        )`;
      const queryParams = [
        invoiceNumber,
        input.serviceCode,
        input.serviceName,
        input.transactionType,
        input.totalAmount,
        input.userId,
      ];
      await Database.connection.execute(query, queryParams);
      const [rows, _] = await Database.connection.execute(
        "SELECT * FROM transactions WHERE invoice_number = ?",
        [invoiceNumber]
      );
      const record = rows as ITransaction[];
      await Database.disconnect();
      return record[0];
    } catch (error) {
      throw error;
    }
  }

  async generateInvoiceNo(): Promise<string> {
    try {
      await Database.connect();
      await Database.connection.execute("INSERT INTO invoice_no () VALUES ()");
      const startOfDay = DateTime.local().startOf("day").toJSDate();
      const endOfDay = DateTime.local().endOf("day").toJSDate();
      const query = `
        SELECT COUNT(*) AS count
        FROM invoice_no
        WHERE created_at BETWEEN ? AND ?
      `;
      const queryParams = [startOfDay, endOfDay];
      const [rows, _] = await Database.connection.execute(query, queryParams);
      const count = (rows as any[])[0].count;
      await Database.disconnect();
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
