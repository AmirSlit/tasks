import userModel from "../../DB/model/user.model.js";

export async function signupUser(userData) {
  const oldeUser = await userModel.findOne({
    where: {
      email: userData.email,
    },
  });
  if (oldeUser) {
    throw new Error("Email already Exists", { cause: { statusCode: 409 } });
  }
  const newUser = await userModel.build(userData);
  await newUser.save();
  return newUser;
}

export async function updateUser(userId, userData) {
  const oldeUser = await userModel.findOne({
    where: {
      id: userId,
    },
  });
  if (!oldeUser) {
    const newUser = await userModel.create(
      {
        id: userId,
        ...userData,
      },
      {
        validate: false,
      },
    );
    return newUser;
  }
  const updatUser = await userModel.update(userData, {
    where: {
      id: userId,
    },
    validate: false,
  });
  return updatUser;
}

export async function getUser(email) {
  const getUser = await userModel.findOne({
    where: {
      email: email,
    },
  });
  if (!getUser) {
    throw new Error("no user found", { cause: { statusCode: 404 } });
  }
  return getUser;
}

export async function getUserExeclud(userId) {
  const getUser = await userModel.findOne({
    where: {
      id: userId,
    },
    attributes: {
      exclude: ["role"],
    },
  });
  if (!getUser) {
    throw new Error("no user found", { cause: { statusCode: 404 } });
  }
  return getUser;
}
