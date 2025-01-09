// models/payment.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/database";

class Payment extends Model {}

Payment.init(
  {
    Payment_Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    Amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    Type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Payment_Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "Payments",
    timestamps: false, // Disable auto timestamps
  }
);

export default Payment;
