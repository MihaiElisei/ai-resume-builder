import { Button } from "@/components/ui/button";
import { Circle, Square, Squircle } from "lucide-react";

// Define an object to store possible border styles
export const BorderStyles = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "squircle",
};

// Convert object values into an array to enable cycling through them
const borderStyles = Object.values(BorderStyles);

interface BorderStyleButtonProps {
  borderStyle: string | undefined; // The currently selected border style
  onChange: (borderStyle: string) => void; // Function to update the selected border style
}

export default function BorderStyleButton({
  borderStyle,
  onChange,
}: BorderStyleButtonProps) {
  function handleClick() {
    // Get the current index of the selected border style
    const currentIndex = borderStyle ? borderStyles.indexOf(borderStyle) : 0;
    // Calculate the next index in a circular manner
    const nextIndex = (currentIndex + 1) % borderStyles.length;
    // Update the border style by calling the onChange function
    onChange(borderStyles[nextIndex]);
  }

  // Determine which icon to display based on the selected border style
  const Icon =
    borderStyle === "square"
      ? Square
      : borderStyle === "circle"
        ? Circle
        : Squircle;

  return (
    <Button
      variant="outline"
      size="icon"
      title="Change border style" // Tooltip for accessibility
      onClick={handleClick} // Handle button click to cycle border styles
    >
      <Icon className="size-5" /> {/* Display the corresponding icon */}
    </Button>
  );
}
