import {
  DataTypes,
  FindAttributeOptions,
  Includeable,
  Model,
  Op,
  Optional,
  WhereOptions,
} from "sequelize";
import Database from "../../config/db";

const databaseInstance = Database.database;

interface SearchCondition {
  keyValue: any;
  operator: symbol;
  keySearch: string | number;
  keyColumn?: string;
}

export interface BaseModelAttributes {
  id?: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
export interface sortOptions {
  key?: string;
  order?: string;
}

interface IPaginate {
  page: number;
  limit: number;
  searchConditions: SearchCondition[];
  sortOptions?: sortOptions;
  includeConditions?: Includeable[];
  attributes?: FindAttributeOptions;
  symbolCondition?: WhereOptions;
}

class BaseModel<
  TAttributes extends BaseModelAttributes,
  TCreationAttributes extends Optional<TAttributes, "id">
> extends Model<TAttributes, TCreationAttributes> {
  public id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static async paginate(input: IPaginate): Promise<{
    data: any[];
    totalCount: number;
    pageSize: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (input.page - 1) * input.limit;

    let whereConditions: WhereOptions = {};

    for (const condition of input.searchConditions) {
      whereConditions[condition.keyColumn ?? condition.keySearch] = {
        [condition.keyValue ? condition.operator : Op.substring]:
          condition.keyValue,
      };
    }
    whereConditions["deletedAt"] = {
      [Op.eq]: null,
    };
    if (input.symbolCondition) {
      whereConditions = { ...whereConditions, ...input.symbolCondition };
    }
    // Apply sorting
    const sortKey = input.sortOptions?.key ?? "id";
    const sortOrder = input.sortOptions?.order ?? "ASC";

    const results = await this.findAndCountAll({
      where: whereConditions,
      order: [[sortKey, sortOrder]],
      limit: input.limit,
      offset,
      include: input.includeConditions,
      attributes: input.attributes,
      distinct: true,
    });

    return {
      data: results.rows,
      totalCount: results.count,
      pageSize: input.limit,
      totalPages: Math.ceil(results.count / input.limit),
      currentPage: input.page,
    };
  }

  static async updateById<T>(id: number, data: Partial<T>): Promise<T> {
    await this.update(data, {
      where: {
        id,
      },
    });
    const updatedData = await this.findOne({
      where: {
        id,
      },
    });
    return updatedData as T;
  }

  static async bulkUpdate<T>(data: any, where: Partial<T>): Promise<T[]> {
    await this.update(data, {
      where,
    });
    const updatedData = await this.findAll({
      where,
    });
    return updatedData as T[];
  }

  static async softDeleteById(id: number): Promise<any> {
    await this.update(
      {
        deletedAt: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );

    return true;
  }

  static async softDelete(where: any): Promise<any> {
    await this.update(
      {
        deletedAt: new Date(),
      },
      {
        where,
      }
    );

    return true;
  }
}

BaseModel.init(
  {
    id: {
      type: new DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: new DataTypes.DATE(),
      allowNull: false,
    },
    updatedAt: {
      type: new DataTypes.DATE(),
      allowNull: false,
    },
    deletedAt: {
      type: new DataTypes.DATE(),
      allowNull: true,
    },
  },
  {
    sequelize: databaseInstance,
    modelName: "BaseModel",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
export const baseModelInit = {
  id: {
    type: new DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
  },
  createdAt: {
    type: new DataTypes.DATE(),
    allowNull: false,
  },
  updatedAt: {
    type: new DataTypes.DATE(),
    allowNull: false,
  },
  deletedAt: {
    type: new DataTypes.DATE(),
    allowNull: true,
  },
};

export const baseModelConfig = {
  sequelize: databaseInstance,
  modelName: "BaseModel",
  timestamps: true,
  paranoid: true,
  underscored: true,
  sync: { force: false },
};
export default BaseModel;
