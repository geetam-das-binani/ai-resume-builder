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

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
        position: optionalString,
      })
    )
    .optional(),
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        school: optionalString,
        degree: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      })
    )
    .optional(),
});
export type EducationValues = z.infer<typeof educationSchema>;

export const resumeSchema = z.object({
  ...generateInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
});

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
  photo?: File | null | string;
};
