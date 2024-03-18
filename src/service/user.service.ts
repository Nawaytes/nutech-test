import argon from "argon2";
import configConstants from "../config/constants";
import Users, { UserCreationAttributes } from "../database/models/user";
import { UpdateProfileDTO } from "../dto/updateProfile.dto";
import { CreateUserDto } from "../dto/user/postUser.dto";
import { BadRequestException } from "../helper/Error/BadRequestException/BadRequestException";
import { NotFoundException } from "../helper/Error/NotFound/NotFoundException";
import MinioService from "./minio.service";
import * as fs from "fs";

export default class UserService {
  minioService: MinioService;

  constructor() {
    this.minioService = new MinioService();
  }

  async create(input: CreateUserDto) {
    try {
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
        attributes: ["email", "first_name", "last_name", "profile_image"],
      });
      if (!user) {
        throw new NotFoundException("user not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateProfileById(
    userId: number,
    input: UpdateProfileDTO
  ): Promise<Users> {
    try {
      await Users.update(
        {
          ...input,
        },
        {
          where: { id: userId },
        }
      );

      return this.getById(userId, [
        "email",
        "first_name",
        "last_name",
        "profile_image",
      ]);
    } catch (error) {
      throw error;
    }
  }

  async getById(userId: number, attributes?: string[]): Promise<Users> {
    try {
      const user = await Users.findOne({
        where: { id: userId },
        attributes: attributes,
      });
      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateById(
    id: number,
    conditions: Partial<UserCreationAttributes>
  ): Promise<Users> {
    try {
      await Users.update({ ...conditions }, { where: { id } });
      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  async updateImage(userId: number, file: Express.Multer.File) {
    try {
      const imageUrl = await this.minioService.uploadFile(
        file,
        file.filename,
        configConstants.MINIO_BUCKET
      );
      const result = await this.updateById(userId, {
        profile_image: imageUrl,
      });
      fs.unlinkSync(file.path);
      return {
        email: result.toJSON().email,
        first_name: result.toJSON().first_name,
        last_name: result.toJSON().last_name,
        profile_image: result.toJSON().profile_image,
      };
    } catch (error) {
      fs.unlinkSync(file.path);
      throw error;
    }
  }
}
