import { sequelize } from "../connection.db.js";
import { DataTypes, Model } from "sequelize";
import userModel from "./user.model.js";
import commentModel from "./comment.model.js";

class postModel extends Model {}
postModel.init(
  {
    title: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
    },
  },
  { sequelize, modelName: "post", paranoid: true },
);

export default postModel;
