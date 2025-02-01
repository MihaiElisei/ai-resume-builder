import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";

interface PageProps {
  // Defining the props interface for the Page component.
  searchParams: Promise<{ resumeId?: string }>; // Props include search parameters, where `resumeId` is optional.
}

// Metadata for the page, which sets the browser tab's title.
export const metadata: Metadata = {
  title: "Design your resume", // Title of the page.
};

export default async function Page({ searchParams }: PageProps) {
  // Destructuring the `resumeId` from search parameters.
  const { resumeId } = await searchParams;

  // Retrieving the authenticated user's ID using Clerk.
  const { userId } = await auth();

  // If the user is not authenticated, return null to render nothing.
  if (!userId) {
    return null;
  }

  // Fetching the resume to edit if a `resumeId` is provided.
  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: { id: resumeId, userId }, // Fetch the resume by its ID and ensure it belongs to the authenticated user.
        include: resumeDataInclude, // Include related data specified in `resumeDataInclude`.
      })
    : null; // If no `resumeId` is provided, set `resumeToEdit` to null.

  // Render the `ResumeEditor` component with the fetched resume data (or null if no resume is being edited).
  return <ResumeEditor resumeToEdit={resumeToEdit} />;
}
