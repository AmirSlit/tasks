import z from "zod";
import { GenderEnum } from "./enum/user.enum.js";
import { messages, t } from "./messages.js";

const validationFields = (lang) => {
  return {
    username: z
      .string({
        error: t(lang, messages.username.string),
      })
      .min(3, {
        error: t(lang, messages.username.min),
      })
      .max(20, {
        error: t(lang, messages.username.max),
      }),
    email: z.email({
      error: t(lang, messages.email.invalid),
    }),
    password: z
      .string({ error: t(lang, messages.password.required) })
      .min(8, {
        error: t(lang, messages.password.min),
      })
      .max(64, {
        error: t(lang, messages.password.max),
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).*$/),
    confirmEmail: z.string({ error: t(lang, messages.password.mismatch) }),
    phone: z.e164({
      error: t(lang, messages.phone.invalid),
    }),
    gender: z.literal(Object.values(GenderEnum), {
      error: t(lang, messages.gender.invalid),
    }),
    DOB: z.coerce.date({ error: t(lang, messages.DOB.invalid) }),
  };
};

export default validationFields;
