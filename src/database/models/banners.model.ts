import { DataTypes, Optional } from "sequelize";
import BaseModel, {
  BaseModelAttributes,
  baseModelConfig,
  baseModelInit,
} from "./base.model";

export interface BannerAttributes extends BaseModelAttributes {
  banner_name: string;
  banner_image: string;
  description: string;
}

export interface BannerCreationAttributes
  extends Optional<BannerAttributes, "id"> {}

export interface BannerInterface extends Required<BannerAttributes> {}

class Banners
  extends BaseModel<BannerAttributes, BannerCreationAttributes>
  implements BannerAttributes
{
  banner_name!: string;
  banner_image!: string;
  description!: string;
}

Banners.init(
  {
    ...baseModelInit,
    banner_name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    banner_image: {
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
