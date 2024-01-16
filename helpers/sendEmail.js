import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const { URK_NET_FROM, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: URK_NET_FROM,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = (data) => {
  const email = {
    ...data,
    from: URK_NET_FROM,
  };
  return transport.sendMail(email);
};
