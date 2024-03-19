import argon from "argon2";

import jwt from "jsonwebtoken";
import configConstants from "../config/constants";
import { LoginDto } from "../dto/auth/login.dto";
import { UnauthorizedException } from "../helper/Error/UnauthorizedException/UnauthorizedException";
import { messages } from "../config/message";
import Database from "./mysql.service";
import { IUsers } from "../helper/interface/db/users.interface";
export class AuthService {
  async login(input: LoginDto) {
    try {
      const user = await this.isAccountValid(input);

      const payload = {
        id: user.id,
        name: user.first_name,
        email: user.email,
      };
      const token = await this.generateToken(payload);
      return {
        token,
      };
    } catch (error) {
      throw new UnauthorizedException(messages.FAILED_LOGIN, 103);
    }
  }

  async isAccountValid(input: LoginDto): Promise<IUsers> {
    const { email, password } = input;
    await Database.connect();
    const [rows, _] = await Database.connection.execute(
      "SELECT * FROM users WHERE email = ? AND deleted_at IS null",
      [email]
    );
    await Database.disconnect();
    const results = rows as IUsers[];
    if (results.length === 0) throw new Error();

    const user = results[0];

    await this.verifyPassword(user.password, password);
    return user;
  }

  async verifyPassword(hash: string, password: string) {
    if (!(await argon.verify(hash, password))) {
      throw new Error();
    }
  }

  async generateToken(payload: any) {
    return jwt.sign(payload, configConstants.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: "5h",
    });
  }
}
