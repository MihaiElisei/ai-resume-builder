import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PaletteIcon } from "lucide-react";
import { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";

interface ColorPickerProps {
  color: Color | undefined; // The currently selected color
  onChange: ColorChangeHandler; // Function to handle color change
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [showPopover, setShowPopover] = useState(false); // State to track whether the color picker popover is open

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Change resume color" // Tooltip for accessibility
          onClick={() => setShowPopover(true)} // Open the popover when the button is clicked
        >
          <PaletteIcon className="size-5" /> {/* Display color palette icon */}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-none bg-transparent shadow-none"
        align="end" // Align the popover content to the end of the button
      >
        <TwitterPicker
          color={color} // Pass the current color to the picker
          onChange={onChange} // Handle color change
          triangle="top-right" // Position the color picker triangle
        />
      </PopoverContent>
    </Popover>
  );
}
