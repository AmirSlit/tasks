import userModel from "../../model/user.model.js";

export async function signup(userData) {
  const { email } = userData;
  const oldUser = await userModel.findOne({ email });
  if (oldUser) {
    throw new Error("Email Already Exists", { cause: { statusCode: 400 } });
  }
  const newUser = await userModel.create(userData);

  return newUser;
}
export async function login(userData) {
  const { email, password } = userData;
  const oldUser = await userModel.findOne({ email, password });
  if (!oldUser) {
    throw new Error("Invalid Email or Password", {
      cause: { statusCode: 400 },
    });
  }

  return "Login";
}
