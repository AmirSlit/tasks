import z from "zod";
import validationFields from "../../common/validation.js";

const loginSchemaBody = z.object({
  email: validationFields.email,
  password: validationFields.password,
});

export const loginSchema = z.object({
  body: loginSchemaBody,
});

export const signupSchema = z.object({
  body: loginSchemaBody
    .extend({
      username: validationFields.username,
      confirmPassword: validationFields.password,
      phone: validationFields.phone,
      gender: validationFields.gender.optional(),
      DOB: validationFields.DOB.optional(),
    })
    .refine(
      (value) => {
        return value.password === value.confirmPassword;
      },
      { error: "Confirm Password doesn't match Password" },
    ),
});
