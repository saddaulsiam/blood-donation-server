import { z } from "zod";

export const BloodGroup = z.enum([
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
]);

const createUser = z.object({
  body: z.object({
    name: z.string({ required_error: "Name field is required." }).min(3, "Name at least 3 characters"),
    email: z.string({ required_error: "Email must be a valid email address." }).email(),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    phoneNumber: z
      .string({ required_error: "Phone number is required" })
      .regex(/^\d{11}$/, "Phone number must be a 11-digit number"),
  }),
});

const verifyEmail = z.object({
  body: z.object({
    code: z.string(),
    email: z.string({ required_error: "Email must be a valid email address." }).email(),
  }),
});

const resendVerificationCode = z.object({
  body: z.object({
    email: z.string({ required_error: "Email must be a valid email address." }).email(),
  }),
});

const loginUser = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string({ required_error: "Email must be a valid email address." }).email(),
  }),
});
const resetPassword = z.object({
  body: z.object({
    id: z.string({ required_error: "id is required" }),
    password: z.string().min(6, "Password must be at least 6 characters long."),
  }),
});

export const AuthValidation = {
  createUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  forgotPassword,
  resetPassword,
};
