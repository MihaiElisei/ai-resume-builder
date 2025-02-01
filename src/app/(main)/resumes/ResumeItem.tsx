"use client";

import ResumePreview from "@/components/ResumePreview";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { format } from "date-fns"; // Correcting the import for date formatting
import Link from "next/link";

interface ResumeItemProps {
  resume: ResumeServerData; // Props include resume data of type `ResumeServerData`
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const wasUpdated = resume.updatedAt !== resume.createdAt; // Checks if the resume was updated

  return (
    <div className="group rounded-lg border border-transparent bg-secondary p-3 transition-colors hover:border-border">
      <div className="space-y-3">
        {/* Link to the resume editor */}
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          {/* Title or fallback text */}
          <p className="line-clamp-1 font-semibold">
            {resume.title || "No title"}
          </p>
          {/* Optional description */}
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          {/* Creation or update date */}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {format(new Date(resume.updatedAt), "MMM d, yyyy h:mm a")}
          </p>
        </Link>
        {/* Preview section with hover shadow */}
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="relative inline-block w-full"
        >
          <ResumePreview
            resumeData={mapToResumeValues(resume)} // Maps the server data to resume values
            className="overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
          />
          {/* Gradient overlay for aesthetic */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
    </div>
  );
}