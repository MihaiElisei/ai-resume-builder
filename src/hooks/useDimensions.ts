import { useEffect, useState } from "react";

// Custom hook to get and track the dimensions of a referenced container element
export default function useDimensions(
  containerRef: React.RefObject<HTMLElement>,
) {
  // State to store the width and height of the element
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const currentRef = containerRef.current; // Get the current DOM element from the ref

    // Function to retrieve the dimensions of the element
    function getDimensions() {
      return {
        width: currentRef?.offsetWidth || 0,
        height: currentRef?.offsetHeight || 0,
      };
    }

    // Create a ResizeObserver to listen for size changes
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]; // Get the first observed entry
      if (entry) {
        setDimensions(getDimensions()); // Update state when the size changes
      }
    });

    if (currentRef) {
      resizeObserver.observe(currentRef); // Start observing the element
      setDimensions(getDimensions()); // Set initial dimensions
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef); // Stop observing on cleanup
      }
      resizeObserver.disconnect(); // Disconnect the observer
    };
  }, [containerRef]); // Runs when containerRef changes

  return dimensions; // Return the current width and height
}
