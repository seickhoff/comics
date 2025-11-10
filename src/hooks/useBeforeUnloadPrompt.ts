import { useEffect } from "react";

/**
 * Warns the user before refreshing, closing, or navigating away.
 * Must be mounted at the top of your app.
 */
export function useBeforeUnloadPrompt(enabled: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!enabled) return;

      e.preventDefault();
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled]);
}
