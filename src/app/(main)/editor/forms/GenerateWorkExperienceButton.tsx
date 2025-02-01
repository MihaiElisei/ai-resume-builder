import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateWorkExperience } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";

// Props for the GenerateWorkExperienceButton component
interface GenerateWorkExperienceButtonProps {
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void; // Callback for the generated work experience
}

// Button component that triggers the AI work experience generation dialog
export default function GenerateWorkExperienceButton({
  onWorkExperienceGenerated,
}: GenerateWorkExperienceButtonProps) {
  const [showInputDialog, setShowInputDialog] = useState(false); // State to manage the visibility of the dialog

  return (
    <>
      <Button
        variant="outline"
        type="button"
        onClick={() => setShowInputDialog(true)} // Open the dialog on button click
      >
        <WandSparklesIcon className="size-4" /> {/* AI Icon */}
        Smart Fill (AI)
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog} // Manage dialog visibility state
        onWorkExperienceGenerated={(workExperience) => {
          onWorkExperienceGenerated(workExperience); // Pass the generated experience to the parent component
          setShowInputDialog(false); // Close the dialog
        }}
      />
    </>
  );
}

// Props for the InputDialog component
interface InputDialogProps {
  open: boolean; // Whether the dialog is open
  onOpenChange: (open: boolean) => void; // Function to toggle dialog visibility
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void; // Callback for the generated work experience
}

// Dialog component for providing work experience description and triggering AI generation
function InputDialog({
  open,
  onOpenChange,
  onWorkExperienceGenerated,
}: InputDialogProps) {
  const { toast } = useToast(); // Hook to show toast notifications

  // Form setup using React Hook Form and Zod for validation
  const form = useForm<GenerateWorkExperienceInput>({
    resolver: zodResolver(generateWorkExperienceSchema), // Validation schema
    defaultValues: {
      description: "", // Default value for the description field
    },
  });

  // Function to handle form submission and AI generation
  async function onSubmit(input: GenerateWorkExperienceInput) {
    try {
      const response = await generateWorkExperience(input); // Call the AI API to generate work experience
      onWorkExperienceGenerated(response); // Pass the generated work experience to the parent component
    } catch (error) {
      console.error(error); // Log any errors
      toast({
        variant: "destructive", // Show error notification
        description: "Something went wrong. Please try again",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate work experience</DialogTitle> {/* Dialog title */}
          <DialogDescription>
            Describe this work experience and the AI will generate an optimized
            entry for you
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control} // Control for the description field
              name="description" // Field name
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel> {/* Label for the field */}
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`E.g "from nov 2019 to dec 2020 I worked at google as a software engineer, my task were:..."`}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage /> {/* Error message for validation */}
                </FormItem>
              )}
            />
            <LoadingButton
              type="submit"
              loading={form.formState.isSubmitting} // Show loading state while submitting
            >
              Generate
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}