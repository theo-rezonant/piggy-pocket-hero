import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom hook that manages focus on route changes for accessibility.
 * Moves focus to the main content area when navigating between pages,
 * ensuring screen reader users are aware of content changes.
 */
export function useFocusOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    // Small delay to ensure the new content is rendered
    const timeoutId = setTimeout(() => {
      // Try to focus the main content element first
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        // Make the element focusable if it isn't already
        if (!mainContent.hasAttribute("tabindex")) {
          mainContent.setAttribute("tabindex", "-1");
        }
        mainContent.focus({ preventScroll: false });
        return;
      }

      // Fallback to focusing the h1 element
      const h1Element = document.querySelector("h1");
      if (h1Element) {
        if (!h1Element.hasAttribute("tabindex")) {
          h1Element.setAttribute("tabindex", "-1");
        }
        h1Element.focus({ preventScroll: false });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);
}
