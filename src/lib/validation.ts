import { z } from "zod";

// A reusable schema for optional strings that trims whitespace and allows empty strings
export const optionalString = z.string().trim().optional().or(z.literal(""));

// Schema for validating the General Info form
export const generalInfoSchema = z.object({
  title: optionalString, // Title field is optional and whitespace-trimmed
  description: optionalString, // Description field is optional and whitespace-trimmed
});

// Type definition for General Info values inferred from the schema
export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

// Schema for validating the Personal Info form
export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>() // Custom type for handling file uploads
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")), // Ensures the file is an image
      "Must be an image file",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4, // Restricts file size to 4MB
      "File must be less than 4MB",
    ),
  firstName: optionalString, // Optional first name field
  lastName: optionalString, // Optional last name field
  jobTitle: optionalString, // Optional job title field
  city: optionalString, // Optional city field
  country: optionalString, // Optional country field
  phone: optionalString, // Optional phone number field
  email: optionalString, // Optional email address field
});

// Type definition for Personal Info values inferred from the schema
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

// Type definition for a single Work Experience entry
export type WorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperiences"]
>[number];

// Schema for validating the Work Experience form
export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString, // Job position field (optional)
        company: optionalString, // Company field (optional)
        startDate: optionalString, // Start date field (optional)
        endDate: optionalString, // End date field (optional)
        description: optionalString, // Job description field (optional)
      }),
    )
    .optional(), // The entire array is optional
});

// Type definition for Work Experience values inferred from the schema
export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

// Schema for validating the Education form
export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString, // Degree field (optional)
        school: optionalString, // School name field (optional)
        startDate: optionalString, // Start date field (optional)
        endDate: optionalString, // End date field (optional)
      }),
    )
    .optional(), // The entire array is optional
});

// Type definition for Education values inferred from the schema
export type EducationValues = z.infer<typeof educationSchema>;

// Schema for validating the Skills form
export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(), // Skills as an optional array of trimmed strings
});

// Type definition for Skills values inferred from the schema
export type SkillsValues = z.infer<typeof skillsSchema>;

// Schema for validating the Summary form
export const summarySchema = z.object({
  summary: optionalString, // Optional summary field
});

// Type definition for Summary values inferred from the schema
export type SummaryValues = z.infer<typeof summarySchema>;

// Comprehensive schema for validating the entire resume by combining all sections
export const resumeSchema = z.object({
  ...generalInfoSchema.shape, // General Info fields
  ...personalInfoSchema.shape, // Personal Info fields
  ...workExperienceSchema.shape, // Work Experience fields
  ...educationSchema.shape, // Education fields
  ...skillsSchema.shape, // Skills fields
  ...summarySchema.shape, // Summary fields
  colorHex: optionalString, // Optional color hex code for styling
  borderStyle: optionalString, // Optional border style (e.g., for profile photo or sections)
});

// Modified type for ResumeValues, allowing the photo field to accept different types
export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string; // Optional unique identifier for the resume
  photo?: File | string | null; // Photo can be a File, a URL string, or null
};

// Schema for generating a work experience description
export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required") // At least one character required
    .min(20, "Must be at least 20 characters"), // Minimum length of 20 characters
});

// Type definition for input when generating work experience descriptions
export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>;

// Schema for generating a summary based on job title, work experience, education, and skills
export const generateSummarySchema = z.object({
  jobTitle: optionalString, // Optional job title
  ...workExperienceSchema.shape, // Work Experience fields
  ...educationSchema.shape, // Education fields
  ...skillsSchema.shape, // Skills fields
});

// Type definition for input when generating a summary
export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;
