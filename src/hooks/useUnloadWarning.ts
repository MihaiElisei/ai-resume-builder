import { useEffect } from "react";

/**
 * A custom React hook that prevents the user from accidentally leaving the page.
 * 
 * @param {boolean} condition - A condition to enable or disable the unload warning. Defaults to true.
 */
export default function useUnloadWarning(condition = true) {
  useEffect(() => {
    // If the condition is false, no listener is added, and the warning is disabled.
    if (!condition) {
      return;
    }

    /**
     * Listener function for the "beforeunload" event.
     * This event triggers when the user attempts to close or refresh the page.
     * The `event.preventDefault()` is required to signal the browser to show the warning.
     */
    const listener = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Chrome requires returnValue to be set to show a dialog, but it's deprecated and ignored in most browsers.
      event.returnValue = "";
    };

    // Add the "beforeunload" event listener to the window object.
    window.addEventListener("beforeunload", listener);

    // Cleanup function to remove the event listener when the component unmounts or condition changes.
    return () => window.removeEventListener("beforeunload", listener);
  }, [condition]); // Dependency array ensures the effect re-runs only when `condition` changes.
}