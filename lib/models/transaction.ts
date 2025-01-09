import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/database";

class Transaction extends Model {}

Transaction.init(
  {
    Transaction_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    User_Id: { type: DataTypes.INTEGER, allowNull: false },
    Amount: { type: DataTypes.FLOAT, allowNull: false },
    Type: { type: DataTypes.STRING, allowNull: false },
    Status: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "Transaction", timestamps: false }
);

export default Transaction;
