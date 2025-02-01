"use server";

import prisma from "@/lib/prisma";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import path from "path";

/**
 * Save or update a resume in the database.
 * Handles creating or updating resumes, photo uploads, and relational data for work experiences and education.
 * 
 * @param {ResumeValues} values - The resume data submitted by the user.
 * @returns {Promise<Object>} - The created or updated resume record.
 * @throws {Error} - Throws errors if the user is not authenticated or if the resume is not found.
 */
export async function saveResume(values: ResumeValues) {
  const { id } = values;

  console.log("received values", values);

  // Validate the incoming data against the schema
  const { photo, workExperiences, educations, ...resumeValues } =
    resumeSchema.parse(values);

  // Authenticate the user
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // TODO: Add logic to limit the number of resumes for non-premium users

  // Check if an existing resume exists for the given ID and user
  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found!");
  }

  // Handle photo upload or deletion
  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    // Delete the existing photo if present
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }

    // Upload the new photo
    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    // Delete the photo if the new photo is explicitly null
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  if (id) {
    // Update the existing resume
    return prisma.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        photoUrl: newPhotoUrl,
        workExperiences: {
          // Clear existing work experiences and replace with new ones
          deleteMany: {},
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          // Clear existing educations and replace with new ones
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  } else {
    // Create a new resume
    return prisma.resume.create({
      data: {
        ...resumeValues,
        userId,
        photoUrl: newPhotoUrl,
        workExperiences: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
      },
    });
  }
}