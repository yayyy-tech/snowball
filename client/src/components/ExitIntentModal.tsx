import { useEffect } from "react";

declare global {
  interface Window {
    __skipBeforeUnload?: boolean;
  }
}

export function skipBeforeUnloadWarning() {
  window.__skipBeforeUnload = true;
}

export function ExitIntentModal() {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (window.__skipBeforeUnload) {
        return;
      }
      
      const pathname = window.location.pathname;
      if (pathname === '/' || 
          pathname.includes('/auth') || 
          pathname.includes('/login') ||
          pathname.includes('/dashboard') ||
          pathname.includes('/previous-plans') ||
          pathname.includes('/retirement-roadmap')) {
        return;
      }
      
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
