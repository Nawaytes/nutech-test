import { messages } from "../config/message";
import { BadRequestException } from "../helper/Error/BadRequestException/BadRequestException";
import {
  IBanner,
  IService,
} from "../helper/interface/db/information.interface";
import Database from "./mysql.service";

export class InformationService {
  async getAllBanners(): Promise<IBanner[]> {
    await Database.connect();
    try {
      const [rows, _] = await Database.connection.execute(
        "SELECT banner_name,banner_image,description FROM banners WHERE deleted_at IS null"
      );
      await Database.disconnect();
      const records = rows as IBanner[];
      return records;
    } catch (error) {
      throw error;
    }
  }

  async getAllServices(): Promise<IService[]> {
    await Database.connect();
    try {
      const [rows, _] = await Database.connection.execute(
        "SELECT service_code,service_name,service_icon,service_tariff FROM services WHERE deleted_at IS null"
      );
      await Database.disconnect();
      const records = rows as IService[];
      return records.map((value) => {
        return {
          ...value,
          service_tariff: parseInt(value.service_tariff as string) as number,
        };
      });
    } catch (error) {
      throw error;
    }
  }

  async getByServiceCode(serviceCode: string): Promise<IService> {
    await Database.connect();
    const query = `
    SELECT * FROM services WHERE service_code = ?
    `;
    const queryParams = [serviceCode];
    const [rows, _] = await Database.connection.execute(query, queryParams);
    const records = rows as IService[];
    await Database.disconnect();

    if (records.length === 0)
      throw new BadRequestException(messages.SERVICE_NOT_FOUND, 102);

    return records[0];
  }
}
