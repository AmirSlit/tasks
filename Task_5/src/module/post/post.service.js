import commentModel from "../../DB/model/comment.model.js";
import postModel from "../../DB/model/post.model.js";
import userModel from "../../DB/model/user.model.js";
import { fn, col } from "sequelize";

export async function creatPost(postData, userId) {
  const oldUser = await userModel.findOne({
    where: {
      id: userId,
    },
  });
  if (!oldUser) {
    throw new Error("user is not found must be signup first", {
      cause: { statusCode: 404 },
    });
  }
  const newPost = await postModel.build({ ...postData, userId });
  await newPost.save();
  return newPost;
}

export async function deletPost(userId, postId) {
  const post = await postModel.findOne({
    where: {
      id: postId,
    },
  });
  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== Number(userId)) {
    throw new Error("you are not authorized delete the post", {
      cause: { statusCode: 403 },
    });
  }
  const deletPost = await postModel.destroy({
    where: {
      id: postId,
    },
  });

  return deletPost;
}

export async function getAllPosts() {
  const allPosts = await postModel.findAll({
    attributes: ["id", "title"],
    include: [
      {
        model: userModel,
        attributes: ["id", "name"],
      },
      {
        model: commentModel,
        attributes: ["id", "content"],
      },
    ],
  });
  return allPosts;
}

export async function countComment() {
  const posts = await postModel.findAll({
    attributes: [
      "id",
      "title",
      [fn("COUNT", col("comments.id")), "commentCount"],
    ],
    include: [
      {
        model: commentModel,
        attributes: [], // مش عايزين نجيب بيانات الكومنتات نفسها، بس نعدّها
      },
    ],
    group: ["post.id"], // لازم نجمع كل الكومنتات الخاصة بكل بوست في صف واحد
    subQuery: false,
  });
  return posts;
}
