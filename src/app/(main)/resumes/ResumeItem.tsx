"use client";

import LoadingButton from "@/components/LoadingButton";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { format } from "date-fns"; // Used for date formatting
import { MoreVertical, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { deleteResume } from "./actions"; // Function to delete the resume
import { useToast } from "@/hooks/use-toast"; // Custom hook for displaying toasts
import { useReactToPrint } from "react-to-print"; // Hook for handling print functionality

// Define the props for ResumeItem component
interface ResumeItemProps {
  resume: ResumeServerData; // The resume data to be displayed in the component
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const contentRef = useRef<HTMLDivElement>(null); // Reference for the content to be printed

  // React-to-print function for printing the resume
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "resume", // Set the document title when printing
  });

  // Check if the resume was updated by comparing updatedAt with createdAt
  const wasUpdated = resume.updatedAt !== resume.createdAt;

  return (
    <div className="group relative rounded-lg border border-transparent bg-secondary p-3 transition-colors hover:border-border">
      <div className="space-y-3">
        {/* Link to resume editor page */}
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          {/* Display the title or fallback text */}
          <p className="line-clamp-1 font-semibold">
            {resume.title || "No title"}
          </p>
          {/* Display the description if available */}
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          {/* Display creation or update date */}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {format(new Date(resume.updatedAt), "MMM d, yyyy h:mm a")}
          </p>
        </Link>
        {/* Link to resume editor for preview */}
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="relative inline-block w-full"
        >
          <ResumePreview
            resumeData={mapToResumeValues(resume)} // Map server data to resume values
            contentRef={contentRef} // Reference passed to the ResumePreview component for printing
            className="overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
          />
          {/* Gradient overlay at the bottom of the preview for design */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
      {/* More options menu for the resume */}
      <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
    </div>
  );
}

// More options menu for the resume item
interface MoreMenuProps {
  resumeId: string; // The resume ID that will be passed to the delete function
  onPrintClick: () => void; // Print click handler, passed from ResumeItem
}

function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {
  // State for showing or hiding delete confirmation dialog
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <>
      {/* Dropdown menu for more options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* Button to trigger the dropdown menu */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* Option to delete the resume */}
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setShowDeleteConfirmation(true)} // Show delete confirmation dialog
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
          {/* Option to print the resume */}
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onPrintClick} // Trigger the print function
          >
            <Printer className="size-4" />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        resumeId={resumeId} // Pass the resumeId to delete confirmation dialog
        open={showDeleteConfirmation} // Open/close the delete confirmation dialog
        onOpenChange={setShowDeleteConfirmation} // Function to change the state of dialog visibility
      />
    </>
  );
}

// Component for the delete confirmation dialog
interface DeleteConfirmationDialogProps {
  resumeId: string; // The resume ID that will be deleted
  open: boolean; // Whether the dialog is open or closed
  onOpenChange: (open: boolean) => void; // Function to control the dialog visibility
}

function DeleteConfirmationDialog({
  resumeId,
  open,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const { toast } = useToast(); // Toast notification hook for feedback

  // Manage the transition state for async delete operation
  const [isPending, startTransition] = useTransition();

  /**
   * Function to handle the delete operation.
   * It calls the deleteResume function and shows feedback via toast.
   *
   * @returns {void}
   */
  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId); // Call the delete function
        onOpenChange(false); // Close the dialog after successful deletion
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive", // Show a destructive toast on error
          description: "Something went wrong. Please try again.",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {/* Title and description of the dialog */}
          <DialogTitle>Delete resume?</DialogTitle>
          <DialogDescription>
            This will permanently delete this resume. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {/* Loading button for the delete action */}
          <LoadingButton
            variant="destructive"
            onClick={handleDelete} // Trigger the delete function when clicked
            loading={isPending} // Show loading state while deleting
          >
            Delete
          </LoadingButton>
          {/* Cancel button to close the dialog */}
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}