import { GenderEnum } from "../../common/enum/user.enum.js";

const validationFields = {
  username: z.string().min(3).max(20),
  email: z.email(),
  password: z.string(),
  phone: z.e164(),
  gender: z.literal(Object.values(GenderEnum)),
  DOB: z.date(),
};

export default validationFields;
