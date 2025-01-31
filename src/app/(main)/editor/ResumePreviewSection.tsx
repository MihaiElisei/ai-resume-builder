import ResumePreview from "@/components/ResumePreview";
import { ResumeValues } from "@/lib/validation";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import { cn } from "@/lib/utils";

interface ResumePreviewSectionProps {
  resumeData: ResumeValues; // Resume data containing user input
  setResumeData: (data: ResumeValues) => void; // Function to update resume data
  className?: string;
}

export default function ResumePreviewSection({
  resumeData,
  setResumeData,
  className
}: ResumePreviewSectionProps) {
  return (
    <div className={cn("group relative hidden md:w-1/2 md:flex w-full", className)}>
      {/* Floating UI controls for color and border style */}
      <div className="absolute left-1 top-1 flex flex-none flex-col gap-3 opacity-50 transition-opacity group-hover:opacity-100 lg:left-3 lg:top-3 xl:opacity-100">
        {/* Color Picker Button */}
        <ColorPicker
          color={resumeData.colorHex} // Pass the current resume color
          onChange={
            (color) => setResumeData({ ...resumeData, colorHex: color.hex }) // Update the resume color on change
          }
        />
        {/* Border Style Toggle Button */}
        <BorderStyleButton
          borderStyle={resumeData.borderStyle} // Pass the current border style
          onChange={
            (borderStyle) => setResumeData({ ...resumeData, borderStyle }) // Update the border style on change
          }
        />
      </div>
      {/* Resume preview container */}
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <ResumePreview
          resumeData={resumeData} // Pass resume data to the preview component
          className="max-w-2xl shadow-md" // Apply styling for a centered preview with shadow
        />
      </div>
    </div>
  );
}
