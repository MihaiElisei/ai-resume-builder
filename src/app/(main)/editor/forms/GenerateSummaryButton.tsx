import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { ResumeValues } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { generateSummary } from "./actions";

// Props definition for the GenerateSummaryButton component
interface GenerateSummaryButtonProps {
  resumeData: ResumeValues; // Resume data required for generating the summary
  onSummaryGenerated: (summary: string) => void; // Callback function to handle the generated summary
}

// Component for generating a resume summary using AI
export default function GenerateSummaryButton({
  resumeData,
  onSummaryGenerated,
}: GenerateSummaryButtonProps) {
  const { toast } = useToast(); // Hook to show toast notifications

  const [loading, setLoading] = useState(false); // State to manage the loading state of the button

  // Function to handle the button click for generating the summary
  async function handleClick() {
    // TODO: Add logic to block this feature for non-premium users

    try {
      setLoading(true); // Set loading state to true while processing
      const aiResponse = await generateSummary(resumeData); // Call the AI function to generate the summary
      onSummaryGenerated(aiResponse); // Pass the generated summary to the callback
    } catch (error) {
      console.error(error); // Log the error for debugging
      toast({
        variant: "destructive", // Display an error toast
        description: "Something went wrong. Please try again",
      });
    } finally {
      setLoading(false); // Reset the loading state after completion
    }
  }

  return (
    <LoadingButton
      variant="outline" // Button style variant
      type="button" // Button type
      onClick={handleClick} // Attach the click handler
      loading={loading} // Show a loading spinner if in the loading state
    >
      <WandSparklesIcon className="size-4" /> {/* Icon for the button */}
      Generate (AI)
    </LoadingButton>
  );
}