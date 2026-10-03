import mongoose, { Schema } from "mongoose";
import { GenderEnum } from "../common/enum/user.enum.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: 2,
      maxLength: 15,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 15,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    DOB: Date,
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    profilePecPath: String,
    coverPicPath: [String],
    DeletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema
  .virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.get("firstName")} ${this.get("lastName")}`;
  });
const userModel = mongoose.model("Users", userSchema);
export default userModel;
