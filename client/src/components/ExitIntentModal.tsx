import { useEffect } from "react";

export function ExitIntentModal() {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Don't exit now. You'd be walking away from decades of compounding that could secure your golden years.";
      return "Don't exit now. You'd be walking away from decades of compounding that could secure your golden years.";
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
}
