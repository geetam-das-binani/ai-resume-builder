import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));
export const generateInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GenerateInfoValues = z.infer<typeof generateInfoSchema>;

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        (file instanceof File && file.type.startsWith("image/")) || !file,
      "File must be an image"
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB"
    ),
  firstName: optionalString,
  lastName: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  jobTitle: optionalString,
  email: optionalString,
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
