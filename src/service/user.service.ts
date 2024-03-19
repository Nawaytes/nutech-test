import argon from "argon2";
import * as fs from "fs";
import configConstants from "../config/constants";
import { CreateUserDto } from "../dto/user/postUser.dto";
import { BadRequestException } from "../helper/Error/BadRequestException/BadRequestException";
import { NotFoundException } from "../helper/Error/NotFound/NotFoundException";
import { IDetailUser, IUsers } from "../helper/interface/db/users.interface";
import MinioService from "./minio.service";
import Database from "./mysql.service";
import { UpdateProfileDTO } from "../dto/updateProfile.dto";
import Users, { UserCreationAttributes } from "../database/models/user";

export default class UserService {
  minioService: MinioService;

  constructor() {
    this.minioService = new MinioService();
  }

  async create(input: CreateUserDto) {
    try {
      await this.isEmailExist(input.email);
      const hashPassword = await argon.hash(input.password);
      await Database.connect();
      await Database.connection.execute(
        "INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)",
        [input.email, input.first_name, input.last_name, hashPassword]
      );
      await Database.disconnect();
      return null;
    } catch (error) {
      throw error;
    }
  }

  async isEmailExist(email: string) {
    try {
      await Database.connect();
      const [rows, _] = await Database.connection.execute(
        "SELECT * FROM users WHERE email = ? AND deleted_at IS null",
        [email]
      );
      await Database.disconnect();
      const user = rows as unknown as IUsers[];
      if (user.length > 0) {
        throw new BadRequestException("Email is already exist", 102);
      }
    } catch (error) {
      throw error;
    }
  }

  async detail(userId: number): Promise<IUsers> {
    try {
      await Database.connect();
      const [rows, _] = await Database.connection.execute(
        "SELECT email, first_name, last_name, profile_image FROM users WHERE id = ? AND deleted_at IS null",
        [userId]
      );
      await Database.disconnect();

      const user = rows as IUsers[];
      if (user.length === 0) throw new NotFoundException("user not found");
      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async updateProfileById(
    userId: number,
    input: UpdateProfileDTO
  ): Promise<IDetailUser> {
    try {
      await Database.connect();
      await Database.connection.execute(
        "UPDATE users SET first_name = ? , last_name = ? WHERE id = ? AND deleted_at IS NULL",
        [input.first_name, input.last_name, userId]
      );
      const [rows, _] = await Database.connection.execute(
        "SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?",
        [userId]
      );
      await Database.disconnect();

      const user = rows as IDetailUser[];
      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async getById(userId: number): Promise<IUsers> {
    try {
      await Database.connect();
      const [rows, _] = await Database.connection.execute(
        "SELECT * FROM users WHERE id = ? AND deleted_at IS NULL",
        [userId]
      );
      const users = rows as IUsers[];
      await Database.disconnect();
      if (users.length === 0) throw new Error();
      return users[0];
    } catch (error) {
      throw error;
    }
  }

  // async updateById(
  //   id: number,
  //   conditions: Partial<UserCreationAttributes>
  // ): Promise<IUsers> {
  //   try {
  //     await Users.update({ ...conditions }, { where: { id } });
  //     return await this.getById(id);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async updateImage(userId: number, file: Express.Multer.File) {
    try {
      const imageUrl = await this.minioService.uploadFile(
        file,
        file.filename,
        configConstants.MINIO_BUCKET
      );

      await Database.connect();

      await Database.connection.execute(
        "UPDATE users SET profile_image = ? WHERE id = ?",
        [imageUrl, userId]
      );

      const [rows, _] = await Database.connection.execute(
        "SELECT * FROM users WHERE id = ?",
        [userId]
      );

      await Database.disconnect();

      const user = rows as IUsers[];
      fs.unlinkSync(file.path);
      return {
        email: user[0].email,
        first_name: user[0].first_name,
        last_name: user[0].last_name,
        profile_image: user[0].profile_image,
      };
    } catch (error) {
      fs.unlinkSync(file.path);
      throw error;
    }
  }
}
