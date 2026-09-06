import { Op } from "sequelize";
import commentModel from "../../DB/model/comment.model.js";
import userModel from "../../DB/model/user.model.js";
import postModel from "../../DB/model/post.model.js";

export async function creatBulkCommetns(commentsData) {
  const creatComments = await commentModel.bulkCreate(commentsData, {
    fields: ["content", "postId", "userId"],
  });

  return creatComments;
}

export async function updateComment(commentId, commentData) {
  const { userId } = commentData;
  const oldeComment = await commentModel.findOne({
    where: {
      id: commentId,
    },
  });
  if (!oldeComment) {
    throw new Error("comment not found", { cause: { statusCode: 404 } });
  }

  if (oldeComment.userId !== Number(userId)) {
    throw new Error("you are not authorized delete the post", {
      cause: { statusCode: 403 },
    });
  }
  const commentUpdate = await commentModel.update(commentData, {
    where: {
      id: commentId,
    },
  });
  return commentUpdate;
}

export async function findOrCreate(commentData) {
  const { userId, postId, content } = commentData;

  const oldComment = await commentModel.findOne({
    where: {
      userId: userId,
      postId: postId,
      content: content,
    },
  });

  if (!oldComment) {
    const createdComment = await commentModel.create(commentData);
    return { comment: createdComment, created: true };
  }

  return { comment: oldComment, created: false };
}

export async function searchComment(word) {
  const comments = await commentModel.findAndCountAll({
    where: {
      content: {
        [Op.like]: `%${word}%`,
      },
    },
  });
  if (!comments) {
    return "no comments found";
  }
  return { count: comments.count, comments: comments.rows };
}

export async function getNewestComments(postId) {
  const comments = await commentModel.findAll({
    where: {
      postId: postId,
    },
    attributes: ["id", "content", "createdAt"],
    order: [["createdAt", "DESC"]],
    limit: 3,
  });
  return comments;
}

export async function GetSpecificComment(commentId) {
  const comment = await commentModel.findByPk(commentId, {
    attributes: ["id", "content"],
    include: [
      {
        model: userModel,
        attributes: ["id", "name", "email"],
      },
      {
        model: postModel,
        attributes: ["id", "title", "content"],
      },
    ],
  });

  if (!comment) {
    return { message: "no comment found." };
  }

  return comment;
}
