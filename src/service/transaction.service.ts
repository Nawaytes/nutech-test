import Users from "../database/models/user";
import { ProcessError } from "../helper/Error/errorHandler";
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
      return parseInt(newData.balance as unknown as string);
    } catch (error) {
      throw error;
    }
  }
}
