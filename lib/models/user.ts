import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/database";

class User extends Model {
  User_Id!: number; // Auto-generated unique user ID
  Password!: string; // User password
  First_Name!: string; // First name
  Last_Name!: string; // Last name
  govId!: string; // Government ID, unique
  CreatedAt!: Date; // Timestamp of account creation
}

User.init(
  {
    User_Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    First_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Last_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    govId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false, // Manually managing timestamps
  }
);

export default User;
