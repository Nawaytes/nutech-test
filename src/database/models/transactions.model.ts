import { DataTypes, Optional } from "sequelize";
import BaseModel, {
  BaseModelAttributes,
  baseModelConfig,
  baseModelInit,
} from "./base.model";

export interface TransactionAttributes extends BaseModelAttributes {
  invoiceNumber: string;
  serviceCode: string;
  serviceName: string;
  transactionType: string;
  totalAmount: number;
  userId: number;
}

export interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, "id"> {}

export interface TransactionInterface extends Required<TransactionAttributes> {}

class Transaction
  extends BaseModel<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  invoiceNumber!: string;
  serviceCode!: string;
  serviceName!: string;
  transactionType!: string;
  totalAmount!: number;
  userId!: number;
}

Transaction.init(
  {
    ...baseModelInit,
    invoiceNumber: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    serviceCode: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    serviceName: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    transactionType: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    totalAmount: {
      type: new DataTypes.DECIMAL(8, 0),
      allowNull: false,
    },
    userId: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  { ...baseModelConfig, tableName: "transactions" }
);

export default Transaction;
