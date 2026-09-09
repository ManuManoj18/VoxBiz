import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();   // MUST be before using process.env

 // Debug

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;