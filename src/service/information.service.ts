import Banners from "../database/models/banners.model";
import Services from "../database/models/services.model";

export class InformationService {
  async getAllBanners(): Promise<Banners[]> {
    try {
      return await Banners.findAll({
        attributes: ["banner_name", "banner_image", "description"],
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllServices(): Promise<Services[]> {
    try {
      return await Services.findAll({
        attributes: [
          "service_code",
          "service_name",
          "service_icon",
          "service_tariff",
        ],
      });
    } catch (error) {
      throw error;
    }
  }
}
