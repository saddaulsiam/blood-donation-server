import { z } from "zod";
import { BloodGroup } from "../Auth/auth.validation";

const updateProfile = z.object({
  body: z.object({
    name: z.string({ required_error: "Name field is required." }).min(3, "Name at least 3 characters").optional(),
    phoneNumber: z
      .string()
      .regex(/^\d{11}$/, "Phone number must be a 11-digit number")
      .optional(),
    bloodGroup: BloodGroup.optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]).optional(),
    city: z.string().optional(),
    availability: z.boolean().optional(),
    bio: z.string().optional(),
    age: z.number().int().positive().optional(),
    photo: z.string().optional(),
    lastDonationDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .optional(),
  }),
});

const changePassword = z.object({
  body: z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
  }),
});

const makeAdmin = z.object({
  body: z.object({
    email: z.string({ required_error: "Email must be a valid email address." }).email(),
  }),
});

const changeUserStatus = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED", "DELETED"]),
  }),
});

export const UserValidation = {
  updateProfile,
  changePassword,
  makeAdmin,
  changeUserStatus,
};
