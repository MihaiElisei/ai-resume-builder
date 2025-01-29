import { generalInfoSchema, GeneralInfoValues } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { useEffect } from "react";

// This component collects and validates general information (title and description).
// Uses react-hook-form for form state management and Zod for validation.

export default function GeneralInfoForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema), // Integrates Zod schema for form validation.
    defaultValues: {
      title: resumeData.title || "",
      description: resumeData.description || "",
    }, // Default empty values for fields.
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger(); // Automatically validate on input change.
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        ...values,
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">General Info</h2>
        <p className="text-sm text-muted-foreground">
          This will not appear on your resume
        </p>
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form action="" className="space-y-3">
          {/* Project Name Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="My Resume" autoFocus />
                </FormControl>
                <FormMessage /> {/* Displays validation error message if any */}
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="A resume for my next job" />
                </FormControl>
                <FormDescription>
                  Describe what this resume is for
                </FormDescription>
                <FormMessage /> {/* Displays validation error message if any */}
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
