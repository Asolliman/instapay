import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/database";

class Investment extends Model {
  
}

Investment.init(
  {
    Investment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      // autoIncrement: true,
    },
    Account_ID: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    Interest: { type: DataTypes.FLOAT, allowNull: false },
    Type: { type: DataTypes.STRING, allowNull: false },
    Investment_Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "Investment", timestamps: false }
);

export default Investment;
