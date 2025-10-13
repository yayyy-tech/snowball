import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "wouter";
import { Snowflake } from "lucide-react";

export function Header() {
  const [location, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <button 
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md -ml-2"
        >
          <Snowflake className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">Snowball</span>
        </button>
        
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setLocation("/#features")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => setLocation("/#how-it-works")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={() => setLocation("/onboarding")} data-testid="button-start-planning">
            Start Planning
          </Button>
        </div>
      </div>
    </header>
  );
}
