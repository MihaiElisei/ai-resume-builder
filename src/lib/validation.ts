import { z } from "zod";

// Optional string schema that trims whitespace and allows an empty string
export const optionalString = z.string().trim().optional().or(z.literal(""));

// Schema for General Info form validation
export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
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
      (file) => !file || file.size <= 1024 * 1024 * 4, // Max file size 4MB
      "File must be less than 4MB"
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString, 
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
