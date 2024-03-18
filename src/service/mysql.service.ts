import mysql from "mysql2/promise";
import configConstants from "../config/constants";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export default class Database {
  static connection: mysql.Connection;

  static async connect() {
    try {
      this.connection = await mysql.createPool({
        host: configConstants.DB_HOST,
        user: configConstants.DB_USER,
        password: configConstants.DB_PASS,
        database: configConstants.DB_NAME,
      });
    } catch (error) {
      throw error;
    }
  }

  static async disconnect() {
    try {
      await this.connection.end();
    } catch (error) {
      throw error;
    }
  }
}
