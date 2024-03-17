import { DataTypes, Optional } from "sequelize";
import BaseModel, {
  BaseModelAttributes,
  baseModelConfig,
  baseModelInit,
} from "./base.model";

export interface UserAttributes extends BaseModelAttributes {
  name: string;
  email: string;
  password: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}
export interface UserInstance extends Required<UserAttributes> {}
class Users
  extends BaseModel<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public name!: string;
  public email!: string;
  public password!: string;
}

Users.init(
  {
    ...baseModelInit,
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
  },
  { ...baseModelConfig, tableName: "users" }
);

export default Users;
