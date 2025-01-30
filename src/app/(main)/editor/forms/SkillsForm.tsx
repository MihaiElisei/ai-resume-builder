import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Textarea } from "@/components/ui/textarea";
  import { EditorFormProps } from "@/lib/types";
  import { skillsSchema, SkillsValues } from "@/lib/validation";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useEffect } from "react";
  import { useForm } from "react-hook-form";
  
  export default function SkillsForm({
    resumeData,
    setResumeData,
  }: EditorFormProps) {
    // Initialize the form with react-hook-form and apply zod validation
    const form = useForm<SkillsValues>({
      resolver: zodResolver(skillsSchema),
      defaultValues: {
        skills: resumeData.skills || [], // Use existing skills data or an empty array
      },
    });
  
    useEffect(() => {
      // Watch form changes and update resume data accordingly
      const { unsubscribe } = form.watch(async (values) => {
        const isValid = await form.trigger(); // Automatically validate input on change
        if (!isValid) return;
  
        setResumeData({
          ...resumeData,
          skills:
            values.skills
              ?.filter((skill) => skill !== undefined) // Remove undefined values
              .map((skill) => skill.trim()) // Trim extra spaces
              .filter((skill) => skill !== "") || [], // Remove empty entries
        });
      });
  
      return unsubscribe; // Cleanup function to avoid memory leaks
    }, [form, resumeData, setResumeData]);
  
    return (
      <div className="mx-auto max-w-xl space-y-6">
        {/* Heading Section */}
        <div className="space-y-1.5 text-center">
          <h2 className="font-serif text-2xl">Skills</h2>
          <p className="text-sm text-muted-foreground">Add your skills</p>
        </div>
  
        {/* Skills Form */}
        <Form {...form}>
          <form className="space-y-3">
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Skills</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="e.g. Python, Java, JavaScript, ..."
                      onChange={(e) => {
                        const skills = e.target.value.split(","); // Split input by commas
                        field.onChange(skills); // Update field value
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate each skill with a comma.
                  </FormDescription>
                  <FormMessage /> {/* Displays validation error messages if any */}
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    );
  }
  