import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { summarySchema, SummaryValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import GenerateSummaryButton from "./GenerateSummaryButton";

// Component for editing the professional summary section of a resume
export default function SummaryForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  // Initialize react-hook-form with default values and Zod validation
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema), // Validation schema
    defaultValues: {
      summary: resumeData.summary || "", // Populate form with existing summary or empty string
    },
  });

  useEffect(() => {
    // Watch for changes in the form values
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger(); // Validate the updated values
      if (!isValid) return; // Skip updating resume data if validation fails

      // Update the parent component's resume data with the form values
      setResumeData({
        ...resumeData,
        ...values,
      });
    });

    return unsubscribe; // Cleanup function to prevent memory leaks
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Section Header */}
      <div className="space-y-1.5 text-center">
        <h2 className="font-serif text-2xl">Professional Summary</h2>
        <p className="text-sm text-muted-foreground">
          Write a short introduction for your resume or let the AI generate one
          from your entered data.
        </p>
      </div>

      {/* Summary Form */}
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="summary" // Form field for the summary
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">
                  Professional Summary
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="A brief, engaging text about yourself"
                  />
                </FormControl>
                <FormMessage /> {/* Show validation errors if any */}
                <GenerateSummaryButton
                  resumeData={resumeData} // Pass the current resume data to the AI generator
                  onSummaryGenerated={(summary) =>
                    form.setValue("summary", summary) // Update the summary field with the AI-generated text
                  }
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}