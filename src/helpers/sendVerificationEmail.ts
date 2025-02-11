// utils/mailer.ts
import nodemailer from "nodemailer";
import config from "../config";

export const sendVerificationEmail = async (email: string, code: string) => {
  // Configure the transporter. Here we use Gmail as an example.
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
    subject: "Blood Donation Verification Code",
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
