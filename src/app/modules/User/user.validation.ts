import { z } from "zod";
import { BloodGroup } from "../Auth/auth.validation";

const updateProfile = z.object({
  body: z.object({
    name: z.string(),
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

export const UserValidation = {
  updateProfile,
  changePassword,
};
