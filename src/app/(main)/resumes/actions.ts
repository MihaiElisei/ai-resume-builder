"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function deleteResume(id: string) {
  // Authenticated user
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated"); // Ensure the user is logged in
  }

  // Fetch the resume and verify ownership
  const resume = await prisma.resume.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!resume) {
    throw new Error("Resume not found!"); // Handle case where the resume does not exist
  }

  // If a photo URL exists, delete the associated file
  if (resume.photoUrl) {
    await del(resume.photoUrl);
  }

  // Delete the resume from the database
  await prisma.resume.delete({
    where: {
      id,
    },
  });

  // Revalidate the resumes page to reflect changes
  revalidatePath("/resumes");
}