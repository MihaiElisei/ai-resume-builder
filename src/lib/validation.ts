import { z } from "zod";

// Optional string schema that trims whitespace and allows an empty string
export const optionalString = z.string().trim().optional().or(z.literal(""));

// Schema for General Info form validation
export const generalInfoSchema = z.object({
  title: optionalString, // Optional title field with trimmed whitespace
  description: optionalString, // Optional description field
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

// Schema for Personal Info form validation
export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>() // Custom type for file validation
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file" // Ensures the file is an image
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4, // Max file size: 4MB
      "File must be less than 4MB"
    ),
  firstName: optionalString, // Optional first name field
  lastName: optionalString, // Optional last name field
  jobTitle: optionalString, // Optional job title field
  city: optionalString, // Optional city field
  country: optionalString, // Optional country field
  phone: optionalString, // Optional phone field
  email: optionalString, // Optional email field
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

// Schema for Work Experience form validation
export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString, // Optional position field
        company: optionalString, // Optional company field
        startDate: optionalString, // Optional start date field
        endDate: optionalString, // Optional end date field
        description: optionalString, // Optional description field
      })
    )
    .optional(), // Work experiences array is optional
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

// Schema for Education form validation
export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString, // Optional degree field
        school: optionalString, // Optional school field
        startDate: optionalString, // Optional start date field
        endDate: optionalString, // Optional end date field
      })
    )
    .optional(), // Educations array is optional
});

export type EducationValues = z.infer<typeof educationSchema>;

// Schema for the entire resume, combining all previous schemas
export const resumeSchema = z.object({
  ...generalInfoSchema.shape, // Includes General Info fields
  ...personalInfoSchema.shape, // Includes Personal Info fields
  ...workExperienceSchema.shape, // Includes Work Experience fields
  ...educationSchema.shape, // Includes Education fields
});

// Type definition for ResumeValues with modifications for the photo field
export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string; // Optional resume ID
  photo?: File | string | null; // Photo can be a File, a URL (string), or null
};
