import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "naboting",
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
};

export const pool = mysql.createPool(dbConfig);
export default dbConfig;

