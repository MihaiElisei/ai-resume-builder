import ResumePreview from "@/components/ResumePreview";
import { ResumeValues } from "@/lib/validation";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";

interface ResumePreviewSectionProps {
  resumeData: ResumeValues; // Resume data containing user input
  setResumeData: (data: ResumeValues) => void; // Function to update resume data
}

export default function ResumePreviewSection({
  resumeData,
  setResumeData,
}: ResumePreviewSectionProps) {
  return (
    <div className="group relative hidden w-1/2 md:flex">
      {/* Floating UI controls for color and border style */}
      <div className="opacity-50 xl:opacity-100 group-hover:opacity-100 transition-opacity absolute left-1 top-1 flex flex-none flex-col gap-3 lg:left-3 lg:top-3">
        {/* Color Picker Button */}
        <ColorPicker
          color={resumeData.colorHex} // Pass the current resume color
          onChange={(color) =>
            setResumeData({ ...resumeData, colorHex: color.hex }) // Update the resume color on change
          }
        />
        {/* Border Style Toggle Button */}
        <BorderStyleButton
          borderStyle={resumeData.borderStyle} // Pass the current border style
          onChange={(borderStyle) =>
            setResumeData({ ...resumeData, borderStyle }) // Update the border style on change
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
