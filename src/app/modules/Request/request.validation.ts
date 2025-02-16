import { z } from "zod";

const createRequest = z.object({
  body: z.object({
    donorId: z.string(),
    name: z.string(),
    phoneNumber: z.string().regex(/^\d{11}$/, "Phone number must be a 11-digit number"),
    dateOfDonation: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    hospitalName: z.string().min(3, "Hospital name must be at least 3 characters long"),
    city: z.string().min(3, "City cannot be empty"),
    message: z.string().min(3, "Message must be at least 3 characters"),
  }),
});

const updateRequest = z.object({
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCEL", "SUCCESSFUL"]),
  }),
});

export const RequestValidation = {
  createRequest,
  updateRequest,
};
