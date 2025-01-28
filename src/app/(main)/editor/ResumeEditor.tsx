"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./Breadcrumbs";

export default function ResumeEditor() {
  const searchParams = useSearchParams();

  // Determine the current step based on the URL parameters or default to the first step
  const currentStep = searchParams.get("step") || steps[0].key;

  // Update the URL with the selected step
  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  // Get the form component corresponding to the current step
  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

  return (
    <div className="flex grow flex-col">
      {/* Header */}
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>

      {/* Main content */}
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          {/* Left column */}
          <div className="w-full p-3 md:w-1/2 overflow-y-auto space-y-6">
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && <FormComponent />}
          </div>

          {/* Separator */}
          <div className="grow md:border-r" />

          {/* Right column */}
          <div className="hidden w-1/2 md:flex">right</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t px-3 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            <Button variant="secondary">Previous step</Button>
            <Button>Next step</Button>
          </div>

          {/* Close and saving status */}
          <div className="flex items-center gap-3">
            <Button variant="secondary" asChild>
              <Link href="/resumes">Close</Link>
            </Button>
            <p className="text-muted-foreground opacity-0">Saving...</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
