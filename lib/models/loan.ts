import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/database";

class Loan extends Model {}

Loan.init(
  {
    Loan_Id: { type: DataTypes.INTEGER, primaryKey: true },
    Account_ID: { type: DataTypes.INTEGER, allowNull: false },
    Amount: { type: DataTypes.FLOAT, allowNull: false },
    Type: { type: DataTypes.STRING, allowNull: false },
    Taken_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "loan", timestamps: false }
);

export default Loan;
