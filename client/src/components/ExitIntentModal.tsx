import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const exitIntentShownRef = useRef(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentShownRef.current) {
        exitIntentShownRef.current = true;
        setIsOpen(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleStay = () => {
    setIsOpen(false);
    exitIntentShownRef.current = false;
  };

  const handleLeave = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent data-testid="exit-intent-modal">
        <AlertDialogHeader>
          <AlertDialogTitle>Wait! Don't Leave Yet</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Don't exit now. You'd be walking away from decades of compounding that could secure your golden years.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLeave} data-testid="button-leave">
            Leave Anyway
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleStay} data-testid="button-stay">
            Stay & Continue Planning
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
