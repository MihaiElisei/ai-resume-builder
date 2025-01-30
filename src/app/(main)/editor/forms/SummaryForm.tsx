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
  
  export default function SummaryForm({
    resumeData,
    setResumeData,
  }: EditorFormProps) {
    // Initialize the form with react-hook-form and apply Zod validation
    const form = useForm<SummaryValues>({
      resolver: zodResolver(summarySchema),
      defaultValues: {
        summary: resumeData.summary || "", // Use existing summary or an empty string
      },
    });
  
    useEffect(() => {
      // Watch for form changes and update resume data accordingly
      const { unsubscribe } = form.watch(async (values) => {
        const isValid = await form.trigger(); // Validate input on change
        if (!isValid) return; // Stop updating if validation fails
  
        setResumeData({
          ...resumeData,
          ...values, // Merge the updated summary with existing resume data
        });
      });
  
      return unsubscribe; // Cleanup function to avoid memory leaks
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
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="A brief, engaging text about yourself"
                    />
                  </FormControl>
                  <FormMessage /> {/* Displays validation errors if any */}
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    );
  }
  