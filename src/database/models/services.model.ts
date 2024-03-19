// import { DataTypes, Optional } from "sequelize";
// import BaseModel, {
//   BaseModelAttributes,
//   baseModelConfig,
//   baseModelInit,
// } from "./base.model";

// export interface ServiceAttributes extends BaseModelAttributes {
//   serviceCode: string;
//   serviceName: string;
//   serviceIcon: string;
//   serviceTariff: number;
// }

// export interface ServicesCreationAttributes
//   extends Optional<ServiceAttributes, "id"> {}

// export interface ServiceInterface extends Required<ServiceAttributes> {}

// class Services
//   extends BaseModel<ServiceAttributes, ServicesCreationAttributes>
//   implements ServiceAttributes
// {
//   serviceCode!: string;
//   serviceName!: string;
//   serviceIcon!: string;
//   serviceTariff!: number;
// }

// Services.init(
//   {
//     ...baseModelInit,
//     serviceCode: {
//       type: new DataTypes.STRING(255),
//       allowNull: false,
//     },
//     serviceName: {
//       type: new DataTypes.STRING(255),
//       allowNull: false,
//     },
//     serviceIcon: {
//       type: new DataTypes.STRING(255),
//       allowNull: false,
//     },
//     serviceTariff: {
//       type: new DataTypes.DECIMAL(8, 0),
//       allowNull: false,
//     },
//   },
//   { ...baseModelConfig, tableName: "services" }
// );

// export default Services;
