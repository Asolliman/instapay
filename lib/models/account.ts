import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/database";

class Account extends Model {}

Account.init(
  {
    Account_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    User_Id: { type: DataTypes.INTEGER, allowNull: false },
    Payment_ID: { type: DataTypes.INTEGER, allowNull: false },
    Type: { type: DataTypes.STRING, allowNull: false },
    Balance: { type: DataTypes.FLOAT, defaultValue: 0 },
    JoinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "Account", timestamps: false }
);

export default Account;
