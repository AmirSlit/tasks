import { sequelize } from "../connection.db.js";
import { DataTypes, Model } from "sequelize";
import userModel from "./user.model.js";
import postModel from "./post.model.js";
class commentModel extends Model {}
commentModel.init(
  {
    content: {
      type: DataTypes.TEXT,
    },
  },
  { sequelize, modelName: "comment" },
);

export default commentModel;
