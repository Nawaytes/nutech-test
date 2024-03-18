import { DataTypes, Optional } from "sequelize";
import BaseModel, {
  BaseModelAttributes,
  baseModelConfig,
  baseModelInit,
} from "./base.model";

export interface BannerAttributes extends BaseModelAttributes {
  bannerName: string;
  bannerImage: string;
  description: string;
}

export interface BannerCreationAttributes
  extends Optional<BannerAttributes, "id"> {}

export interface BannerInterface extends Required<BannerAttributes> {}

class Banners
  extends BaseModel<BannerAttributes, BannerCreationAttributes>
  implements BannerAttributes
{
  bannerName!: string;
  bannerImage!: string;
  description!: string;
}

Banners.init(
  {
    ...baseModelInit,
    bannerName: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    bannerImage: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { ...baseModelConfig, tableName: "banners" }
);

export default Banners;
