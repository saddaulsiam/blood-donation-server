import { z } from "zod";

const createRequest = z.object({
  body: z.object({
    donorId: z.string(),
    phoneNumber: z.string().regex(/^\d{11}$/, "Phone number must be a 11-digit number"),
    dateOfDonation: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    hospitalName: z.string().min(3, "Hospital name cannot be empty"),
    city: z.string().min(3, "city cannot be empty"),
  }),
});

const updateRequest = z.object({
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCEL"]),
  }),
});

export const RequestValidation = {
  createRequest,
  updateRequest,
};
