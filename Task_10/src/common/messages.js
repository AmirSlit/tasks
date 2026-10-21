import { SystemLanguageEnum } from "./enum/system.enum.js";

const { EN, AR } = SystemLanguageEnum;

export const messages = {
  username: {
    string: {
      [EN]: "The username should be a string",
      [AR]: "يجب أن يكون اسم المستخدم نصاً",
    },
    min: {
      [EN]: "The username must be at least 3 characters",
      [AR]: "يجب ألا يقل اسم المستخدم عن 3 أحرف",
    },
    max: {
      [EN]: "The username must be at most 20 characters",
      [AR]: "يجب ألا يزيد اسم المستخدم عن 20 حرفاً",
    },
  },

  email: {
    invalid: {
      [EN]: "Email must follow this pattern email@domain.com",
      [AR]: "يجب أن يتبع البريد الإلكتروني النمط email@domain.com",
    },
  },

  password: {
    required: {
      [EN]: "Password is required",
      [AR]: "كلمة المرور مطلوبة",
    },
    min: {
      [EN]: "Password must be at least 8 characters",
      [AR]: "يجب ألا تقل كلمة المرور عن 8 أحرف",
    },
    max: {
      [EN]: "Password must be at most 64 characters",
      [AR]: "يجب ألا تزيد كلمة المرور عن 64 حرفاً",
    },
    mismatch: {
      [EN]: "Confirm Password doesn't match Password",
      [AR]: "تأكيد كلمة المرور لا يطابق كلمة المرور",
    },
  },

  phone: {
    invalid: {
      [EN]: "Invalid phone number (use format +201012345678)",
      [AR]: "رقم هاتف غير صالح (استخدم التنسيق +201012345678)",
    },
  },

  gender: {
    invalid: (values) => ({
      [EN]: `Gender must be one of: ${values.join(", ")}`,
      [AR]: `يجب أن يكون الجنس واحداً من: ${values.join(", ")}`,
    }),
  },

  DOB: {
    invalid: {
      [EN]: "Invalid date of birth",
      [AR]: "تاريخ الميلاد غير صالح",
    },
  },
};

export const t = (lang, entry) => entry[lang] ?? entry[EN];

export const resolveLanguage = (header = "") =>
  header.toLowerCase().startsWith("ar") ? AR : EN;
