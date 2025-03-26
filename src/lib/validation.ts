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
      })
    )
    .optional(),
});
export type EducationValues = z.infer<typeof educationSchema>;

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
});

export type SkillValues = z.infer<typeof skillsSchema>;

export const summarySchema = z.object({
  summary: optionalString,
});
export type SummaryValues = z.infer<typeof summarySchema>;

export const resumeSchema = z.object({
  ...generateInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
});

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
  photo?: File | null | string;
};

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
});


export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;