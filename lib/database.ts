import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql2 from "mysql2";

// Load environment variables from .env file
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "instapay", // Default fallback to avoid empty values
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "admin",
  {
    dialect: "mysql",
    dialectModule: mysql2, // Required for MySQL support
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10), // Default MySQL port
    logging: false, // Disable logging for a cleaner console output
  }
);

export async function connectToDatabase() {
  try {
    console.log("Connecting to the database...");
    await sequelize.authenticate(); // Check the connection
    console.log("Connection established successfully.");

    console.log("Synchronizing database models...");
    await sequelize.sync(); // Sync models to the database
    console.log("All models synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error; // Re-throw error to stop execution on failure
  }
}

export default sequelize;
