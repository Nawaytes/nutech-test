import argon from "argon2";
import Users from "../database/models/user";

import jwt from "jsonwebtoken";
import configConstants from "../config/constants";
import { LoginDto } from "../dto/auth/login.dto";
import { UnauthorizedException } from "../helper/Error/UnauthorizedException/UnauthorizedException";
import { messages } from "../config/message";
export class AuthService {
  async login(input: LoginDto) {
    try {
      const user = await this.isAccountValid(input);
      const userJson = user.toJSON();
      const payload = {
        id: userJson.id,
        name: userJson.first_name,
        email: userJson.email,
      };
      const token = await this.generateToken(payload);
      return {
        token,
      };
    } catch (error) {
      throw new UnauthorizedException(messages.FAILED_LOGIN, 103);
    }
  }

  async isAccountValid(input: LoginDto): Promise<Users> {
    const { email, password } = input;
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error();
    await this.verifyPassword(user.password!, password);
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
