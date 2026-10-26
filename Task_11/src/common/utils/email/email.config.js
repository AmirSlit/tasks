import { createTransport } from "nodemailer";
import { EMAIL_PASSWORD, EMAIL_USER } from "../../../config/config.js";

const transporter = createTransport({
  service: "Gmail", // Use any Service ID from the table below (matching is case-insensitive)
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export default transporter;
