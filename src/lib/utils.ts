import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeServerData } from "./types";
import { ResumeValues } from "./validation";

export function cn(...inputs: ClassValue[]) {
  // Utility function to combine and merge class names.
  return twMerge(clsx(inputs)); // Combines class names using `clsx` and resolves conflicts with `twMerge`.
}

export function fileReplacer(key: unknown, value: unknown) {
  // Utility function for JSON stringification to handle `File` objects.
  return value instanceof File
    ? {
        // If the value is a `File` object, return a serialized version with key details.
        name: value.name, // File name
        size: value.size, // File size in bytes
        type: value.type, // MIME type
        lastModified: value.lastModified, // Last modified timestamp
      }
    : value; // If not a `File`, return the original value.
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  // Maps server-side resume data to the client-side structure.
  return {
    id: data.id, // Resume ID
    title: data.title || undefined, // Title or undefined if not present
    description: data.description || undefined, // Description or undefined
    photo: data.photoUrl || undefined, // URL of the photo or undefined
    firstName: data.firstName || undefined, // First name or undefined
    lastName: data.lastName || undefined, // Last name or undefined
    jobTitle: data.jobTitle || undefined, // Job title or undefined
    city: data.city || undefined, // City or undefined
    country: data.country || undefined, // Country or undefined
    phone: data.phone || undefined, // Phone number or undefined
    email: data.email || undefined, // Email address or undefined

    // Map work experiences to the required structure.
    workExperiences: data.workExperiences.map((exp) => ({
      position: exp.position || undefined, // Job position or undefined
      company: exp.company || undefined, // Company name or undefined
      startDate: exp.startDate?.toISOString().split("T")[0], // Start date formatted as YYYY-MM-DD or undefined
      endDate: exp.endDate?.toISOString().split("T")[0], // End date formatted as YYYY-MM-DD or undefined
      description: exp.description || undefined, // Description or undefined
    })),

    // Map educations to the required structure.
    educations: data.educations.map((edu) => ({
      degree: edu.degree || undefined, // Degree or undefined
      school: edu.school || undefined, // School name or undefined
      startDate: edu.startDate?.toISOString().split("T")[0], // Start date formatted as YYYY-MM-DD or undefined
      endDate: edu.endDate?.toISOString().split("T")[0], // End date formatted as YYYY-MM-DD or undefined
    })),

    skills: data.skills, // Skills array
    borderStyle: data.borderStyle, // Border style for the resume
    colorHex: data.colorHex, // Color code for styling
    summary: data.summary || undefined, // Summary or undefined
  };
}
