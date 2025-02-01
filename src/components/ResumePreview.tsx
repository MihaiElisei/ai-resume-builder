import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { Badge } from "./ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

// Define the ResumePreviewProps interface for the props expected by the ResumePreview component
interface ResumePreviewProps {
  resumeData: ResumeValues; // Resume data containing all user-inputted information
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string; // Optional className for styling customization
}

// ResumePreview component which displays the resume preview
export default function ResumePreview({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null); // Reference for the preview container
  const { width } = useDimensions(containerRef as React.RefObject<HTMLElement>); // Get container width dynamically

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black", // A4 size aspect ratio styling
        className,
      )}
      ref={containerRef} // Attach the reference to the container
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")} // Make the content invisible if width is not available
        style={{
          zoom: (1 / 794) * width, // Dynamically scale content based on container width
        }}
        ref={contentRef} // Reference for the content section
        id="resumePreviewContent"
      >
        {/* Resume sections */}
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  );
}

// Define a common prop structure for all resume sections
interface ResumeSectionProps {
  resumeData: ResumeValues; // Resume data containing all user-inputted information
}

// Personal info header displaying the name, title, and contact info
function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
  } = resumeData;

  // Manage photo URL dynamically for file uploads
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    // Convert the uploaded file to a URL for display
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl); // Update photo source URL
    if (photo === null) setPhotoSrc(""); // Reset photo if it was removed
    return () => URL.revokeObjectURL(objectUrl); // Cleanup on component unmount
  }, [photo]);

  return (
    <div className="flex items-center gap-6">
      {/* Display profile photo if available */}
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="Author photo"
          className="aspect-square object-cover"
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px" // Square border style
                : borderStyle === BorderStyles.CIRCLE
                ? "9999px" // Circular border style
                : "10%", // Default border radius
          }}
        />
      )}
      {/* Display personal details like name, title, and contact info */}
      <div className="w-full space-y-2.5 text-center">
        <div className="space-y-1">
          <p className="text-3xl font-bold" style={{ color: colorHex }}>
            {firstName} {lastName} {/* Full name */}
          </p>
          <p className="font-medium" style={{ color: colorHex }}>
            {jobTitle} {/* Job title */}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country ? ", " : ""}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")} {/* Contact details */}
        </p>
      </div>
    </div>
  );
}

// Summary section to display the professional profile
function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null; // Hide section if no summary is provided
  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="break-inside-avoid space-y-3">
        <p className="font-lg font-semibold" style={{ color: colorHex }}>
          Professional Profile {/* Section title */}
        </p>
        <div className="ml-5 mr-5 whitespace-pre-line text-justify text-sm">
          {summary} {/* Display the professional summary */}
        </div>
      </div>
    </>
  );
}

// Work experience section to display job history
function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences, colorHex } = resumeData;

  // Filter out empty work experiences
  const workExperiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperiencesNotEmpty?.length) return null; // Hide section if no work experiences are provided

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Work Experience {/* Section title */}
        </p>
        {workExperiencesNotEmpty.map((exp, index) => (
          <div key={index} className="ml-5 break-inside-avoid space-y-1">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: colorHex }}
            >
              <span>{exp.position}</span> {/* Job position */}
              {exp.startDate && (
                <span>
                  {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"} {/* Employment period */}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{exp.company}:</p> {/* Company name */}
            <div className="ml-4 mr-5 whitespace-pre-line text-justify text-xs">
              {exp.description} {/* Job description */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Education section to display academic history
function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex } = resumeData;

  // Filter out empty education entries
  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationsNotEmpty?.length) return null; // Hide section if no education entries are provided

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Education {/* Section title */}
        </p>
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="ml-5 break-inside-avoid space-y-1">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: colorHex }}
            >
              <span>{edu.degree}</span> {/* Degree obtained */}
              {edu.startDate && (
                <span>
                  {edu.startDate &&
                    `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`} {/* Duration */}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p> {/* School name */}
          </div>
        ))}
      </div>
    </>
  );
}

// Skills section to display the skillset
function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex, borderStyle } = resumeData;

  if (!skills?.length) return null; // Hide section if no skills are provided

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Skills {/* Section title */}
        </p>
        <div className="ml-5 flex break-inside-avoid flex-wrap justify-evenly gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              className="rounded-md bg-black text-white hover:bg-black"
              style={{
                backgroundColor: colorHex, // Dynamic background color based on resumeData
                borderRadius:
                  borderStyle === BorderStyles.SQUARE
                    ? "0px" // Square border style
                    : borderStyle === BorderStyles.CIRCLE
                    ? "9999px" // Circular border style
                    : "8px", // Default border radius
              }}
            >
              {skill} {/* Display each skill */}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}