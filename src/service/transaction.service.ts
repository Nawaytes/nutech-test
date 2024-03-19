import { DateTime } from "luxon";

import { messages } from "../config/message";
import { TransactionDto } from "../dto/transaction.dto";
import { BadRequestException } from "../helper/Error/BadRequestException/BadRequestException";
import { ITransaction } from "../helper/interface/db/transaction.interface";
import { IInputTransaction } from "../helper/interface/transaction/transaction.interface";
import { InformationService } from "./information.service";
import Database from "./mysql.service";
import UserService from "./user.service";

export class TransactionService {
  userService: UserService;
  informationService: InformationService;

  constructor() {
    this.userService = new UserService();
    this.informationService = new InformationService();
  }
  async getBalance(userId: number): Promise<number> {
    try {
      const user = await this.userService.getById(userId);
      return parseInt(user.balance);
    } catch (error) {
      throw error;
    }
  }
  async updateBalance(userId: number, balance: number) {
    await Database.connect();
    const query = `
    UPDATE users SET balance = ? WHERE id = ?
    `;
    const queryParams = [balance, userId];
    await Database.connection.execute(query, queryParams);
    await Database.disconnect();
  }
  async topup(userId: number, topUpAmount: number): Promise<number> {
    try {
      const user = await this.userService.getById(userId);
      const newBalance: number = parseInt(user.balance) + topUpAmount;

      await this.updateBalance(userId, newBalance);
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
      const service = await this.informationService.getByServiceCode(
        input.service_code
      );

      const user = await this.userService.getById(userId);

      if (!service) {
        throw new BadRequestException(messages.SERVICE_NOT_FOUND, 102);
      }
      const balance = parseInt(user.balance);
      const tarif = parseInt(service.service_tariff as string);
      if (balance < tarif) {
        throw new BadRequestException(messages.BALACE_NOT_ENOUGH, 102);
      }
      const newBalance = balance - tarif;
      await this.updateBalance(userId, newBalance);
      const transaction = await this.recordTransaction({
        serviceCode: service.service_code,
        serviceName: service.service_name,
        totalAmount: parseInt(service.service_tariff as string),
        transactionType: "PAYMENT",
        userId,
      });

      return {
        invoice_number: transaction.invoice_number,
        service_code: transaction.service_code,
        service_name: transaction.service_name,
        transaction_type: transaction.transaction_type,
        total_amount: parseInt(transaction.total_amount),
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

  async page(userId: number, page: number, limit: number) {
    try {
      await Database.connect();
      const offset = Math.max(page - 1, 0) * Math.abs(limit);
      const paginateQuery = `
        SELECT invoice_number, transaction_type, service_name AS description, total_amount, created_at AS created_on
        FROM transactions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?, ?`;

      const [rawRows, _f] = await Database.connection.execute(paginateQuery, [
        userId,
        offset.toString(),
        limit.toString(),
      ]);
      const rows = rawRows as any[];
      await Database.disconnect();

      const records = rows.map((row) => ({
        invoice_number: row.invoice_number,
        transaction_type: row.transaction_type,
        description: row.description,
        total_amount: row.total_amount,
        created_on: row.created_on,
      }));

      return {
        limit,
        offset,
        records,
      };
    } catch (error) {
      throw error;
    }
  }
}
