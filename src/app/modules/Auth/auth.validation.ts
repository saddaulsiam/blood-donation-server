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
    name: z.string({ required_error: "Name field is required." }),
    email: z.string({ required_error: "Email must be a valid email address." }).email(),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    bloodGroup: BloodGroup.optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]).optional(),
    city: z.string({ required_error: "city field is required." }).default(""),
    availability: z.boolean().default(false),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
  }),
});

const loginUser = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

export const AuthValidation = {
  createUser,
  loginUser,
};
