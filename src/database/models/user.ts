import { DataTypes, Optional } from "sequelize";
import BaseModel, {
  BaseModelAttributes,
  baseModelConfig,
  baseModelInit,
} from "./base.model";

export interface UserAttributes extends BaseModelAttributes {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  profile_image?: string;
  balance?: number;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}
export interface UserInstance extends Required<UserAttributes> {}
class Users
  extends BaseModel<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  email!: string;
  first_name!: string;
  last_name!: string;
  password!: string;
  profile_image!: string;
  balance!: number;
}

Users.init(
  {
    ...baseModelInit,
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    first_name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    last_name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    profile_image: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    balance: {
      type: new DataTypes.DECIMAL(9, 0),
      allowNull: true,
    },
  },
  { ...baseModelConfig, tableName: "users" }
);

export default Users;
