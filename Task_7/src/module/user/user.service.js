import userModel from "../../model/user.model.js";

export async function updateUser(id, userData) {
  const { email, password, ...restData } = userData;

  const oldUser = await userModel.findById(id);
  if (!oldUser) {
    throw new Error("User not Found", { cause: { statusCode: 404 } });
  }

  const user = await userModel.findOne({ email, _id: { $ne: id } });
  if (user) {
    throw new Error("Email Already Exists", { cause: { statusCode: 400 } });
  }
  const update = await userModel.updateOne({ _id: id }, restData);
  return update;
}

export async function deleteUser(userId) {
  const oldUser = await userModel.findById(userId);
  if (!oldUser) {
    throw new Error("User not Found", { cause: { statusCode: 404 } });
  }
  const deleteUser = await userModel.deleteOne({ _id: userId });
  return "User Deleted!";
}

export async function getUser(userId) {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User is not found", { cause: { statusCode: 404 } });
  }
  return user;
}
