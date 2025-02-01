import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { fileReplacer } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveResume } from "./actions";

export default function useAutoSaveResume(resumeData: ResumeValues) {
  const searchParams = useSearchParams(); // Access query parameters from the URL

  const { toast } = useToast(); // Hook for displaying toast notifications

  const debouncedResumeData = useDebounce(resumeData, 1500); // Debounce resume data to avoid frequent saves

  const [resumeId, setResumeId] = useState(resumeData.id); // State to track the current resume ID
  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData), // Clone the resume data for tracking last saved state
  );

  const [isSaving, setIsSaving] = useState(false); // State to track saving status
  const [isError, setIsError] = useState(false); // State to track errors during save operations

  useEffect(() => {
    setIsError(false); // Reset error state whenever debounced data changes
  }, [debouncedResumeData]);

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true); // Indicate saving is in progress
        setIsError(false); // Reset error state

        const newData = structuredClone(debouncedResumeData); // Clone debounced resume data for processing

        // Save the resume, excluding unchanged photo data
        const updatedResume = await saveResume({
          ...newData,
          ...(JSON.stringify(lastSavedData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          id: resumeId, // Include the current resume ID
        });

        setResumeId(updatedResume.id); // Update resume ID (important for new resumes)
        setLastSavedData(newData); // Update the last saved state

        // Update the URL's resumeId if it has changed
        if (searchParams.get("resumeId") !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updatedResume.id);
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`,
          );
        }
      } catch (error) {
        setIsError(true); // Indicate an error occurred
        console.error(error); // Log the error for debugging

        // Show a toast notification to the user with a retry option
        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes.</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss(); // Dismiss the toast notification
                  save(); // Retry the save operation
                }}
              >
                Retry
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false); // Indicate saving has finished
      }
    }

    // Check for unsaved changes and trigger the save function
    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save(); // Save the changes
    }
  }, [
    debouncedResumeData, // Dependency: Debounced data
    isSaving, // Dependency: Saving state
    lastSavedData, // Dependency: Last saved data
    isError, // Dependency: Error state
    resumeId, // Dependency: Current resume ID
    searchParams, // Dependency: URL search parameters
    toast, // Dependency: Toast notification hook
  ]);

  return {
    isSaving, // Return saving state
    // Return whether there are unsaved changes
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  };
}
