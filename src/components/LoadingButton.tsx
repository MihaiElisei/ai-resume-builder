import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";

// Define interface for LoadingButton props, extending base ButtonProps
interface LoadingButtonProps extends ButtonProps {
  loading: boolean; // Flag to indicate loading state
}

// LoadingButton component definition
export default function LoadingButton({
  loading, // Whether the button is in a loading state
  disabled, // Whether the button is disabled
  className, // Additional class names for styling
  ...props // Spread the rest of the ButtonProps
}: LoadingButtonProps) {
  return (
    <Button
      // Disable the button if it's loading or explicitly disabled
      disabled={loading || disabled}
      // Apply additional styling and ensure flexibility with className prop
      className={cn("flex items-center gap-2", className)}
      {...props} // Pass down remaining props to the base Button component
    >
      {/* Show the loader spinner if in a loading state */}
      {loading && <Loader2 className="size-5 animate-spin" />}
      {/* Render the button's children (e.g., text or content inside the button) */}
      {props.children}
    </Button>
  );
}
