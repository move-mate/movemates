import { z } from "zod";

export const waitlistSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .refine((val) => val.trim().split(" ").length >= 2, {
      message: "Please enter name and surname",
    }),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^(?:\+27|0)[6-8][0-9]{8}$/, "Invalid South African phone"),
  type: z.enum(["customer", "driver"], {
    errorMap: () => ({ message: "Please select a role" }),
  } as any),
  social: z.string().min(1, "Please select an option"),
  province: z.string().min(1, "Province is required"),
  city: z.string().min(1, "City is required"),
});

export type FormData = z.infer<typeof waitlistSchema>;