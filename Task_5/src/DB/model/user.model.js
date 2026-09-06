import { sequelize } from "../connection.db.js";
import { DataTypes } from "sequelize";

const userModel = sequelize.define(
  "user",
  {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        checkPasswordLength(value) {
          if (value.length < 6) {
            throw new Error("The Password must be greater than 6 chars", {
              cause: { statusCode: 400 },
            });
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  },
  function checkNameLength(value) {
    if (value <= 2) {
      throw new Error("The name must be greater Than 2 chars", {
        cause: { statusCode: 400 },
      });
    }
  },
  {
    hooks: {
      beforeCreate: (user) => {
        checkNameLength(user);
      },
    },
  },
);

export default userModel;
