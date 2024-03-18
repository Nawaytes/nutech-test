import Banners from "../database/models/banners.model";

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
}
