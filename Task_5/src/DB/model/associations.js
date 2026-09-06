import userModel from "./user.model.js";
import postModel from "./post.model.js";
import commentModel from "./comment.model.js";

// User - Post
userModel.hasMany(postModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
postModel.belongsTo(userModel, { foreignKey: "userId" });

// User - Comment
userModel.hasMany(commentModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
commentModel.belongsTo(userModel, { foreignKey: "userId" });

// Post - Comment
postModel.hasMany(commentModel, {
  foreignKey: { name: "postId", allowNull: false },
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
commentModel.belongsTo(postModel, { foreignKey: "postId" });

export { userModel, postModel, commentModel };
