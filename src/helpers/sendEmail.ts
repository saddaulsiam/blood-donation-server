import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async ({
  email,
  subject,
  message,
  htmlMessage,
}: {
  email: string;
  subject: string;
  message?: string;
  htmlMessage?: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.email.email_user,
      pass: config.email.email_password,
    },
  });

  const mailOptions = {
    from: config.email.email_user,
    to: email,
    subject,
    text: message,
    html: htmlMessage,
  };

  await transporter.sendMail(mailOptions);
};
