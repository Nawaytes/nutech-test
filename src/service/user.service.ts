import argon from "argon2";
import Users from "../database/models/user";
import { CreateUserDto } from "../dto/user/postUser.dto";
import { BadRequestException } from "../helper/Error/BadRequestException/BadRequestException";
import { NotFoundException } from "../helper/Error/NotFound/NotFoundException";

export default class UserService {
  async create(input: CreateUserDto) {
    try {
      console.log(input);
      await this.isEmailExist(input.email);
      await Users.create({
        ...input,
        password: await argon.hash(input.password),
      });
      return null;
    } catch (error) {
      throw error;
    }
  }

  async isEmailExist(email: string) {
    try {
      const user = await Users.findOne({
        where: {
          email,
        },
      });
      if (user) {
        throw new BadRequestException("Email is already exist", 102);
      }
    } catch (error) {
      throw error;
    }
  }

  async detail(userId: number): Promise<Users> {
    try {
      const user = await Users.findOne({
        where: {
          id: userId,
        },
        attributes: ["id", "name", "email"],
      });
      if (!user) {
        throw new NotFoundException("user not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // async page(input: IPaginate<UserCreationAttributes>) {
  //   try {
  //     const page = input.page ?? 1;
  //     const limit = input.limit ?? 10;
  //     const offset = Math.max(page - 1, 0) * limit;
  //     const conditions = removeLimitAndPage(input.data);
  //     const users = await Users.findAndCountAll({
  //       where: {
  //         name: {
  //           [Op.like]: `%${conditions.name}%`,
  //         },
  //       },
  //       limit,
  //       offset: offset,
  //       order: [["id", "DESC"]],
  //     });
  //     return users;
  //   } catch (error: any) {
  //     throw new BadRequestException(`Error paginating users: ${error.message}`);
  //   }
  // }
}
