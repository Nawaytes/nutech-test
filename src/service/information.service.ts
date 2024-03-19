import Database from "./mysql.service";

export class InformationService {
  async getAllBanners(): Promise<any> {
    await Database.connect();
    try {
      const [rows, _] = await Database.connection.execute(
        "SELECT banner_name,banner_image,description FROM banners WHERE deleted_at IS null"
      );
      await Database.disconnect();
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async getAllServices(): Promise<any> {
    await Database.connect();
    try {
      const [rows, _] = await Database.connection.execute(
        "SELECT service_code,service_name,service_icon,service_tariff FROM services WHERE deleted_at IS null"
      );
      await Database.disconnect();

      return rows;
    } catch (error) {
      throw error;
    }
  }
}
