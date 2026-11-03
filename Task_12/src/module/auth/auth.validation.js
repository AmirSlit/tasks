import z, { email } from "zod";
import validationFields from "../../common/validation.js";

const loginSchemaBody = (lang) => {
  return z.object({
    email: validationFields(lang).email,
    password: validationFields(lang).password,
  });
};

export const loginSchema = (lang) => {
  return z.object({
    body: loginSchemaBody(lang),
  });
};

export const signupSchema = (lang) => {
  return z.object({
    body: loginSchemaBody(lang)
      .extend({
        username: validationFields(lang).username,
        confirmPassword: validationFields(lang).password,
        phone: validationFields(lang).phone,
        gender: validationFields(lang).gender.optional(),
        DOB: validationFields(lang).DOB.optional(),
      })
      .refine(
        (value) => {
          return value.password === value.confirmPassword;
        },
        { error: "Confirm Password doesn't match Password" },
      ),
  });
};

export const logoutSchema = (lang) => {
  return z.object({
    body: z.object({
      action: validationFields(lang).action,
    }),
  });
};

export const ConfirmEmailSchema = (lang) => {
  return z.object({
    body: z.object({
      email: validationFields(lang).email,
      otp: validationFields(lang).otp,
    }),
  });
};

export const verifyForgetPasswordOTPSchema = (lang) => {
  return z.object({
    body: z.object({
      email: validationFields(lang).email,
      otp: validationFields(lang).otp,
    }),
  });
};

export const resendOTPSchema = (lang) => {
  return z.object({
    body: z.object({
      email: validationFields(lang).email,
    }),
  });
};

export const sendOtpForgetPasswordSchema = (lang) => {
  return z.object({
    body: z.object({
      email: validationFields(lang).email,
    }),
  });
};
