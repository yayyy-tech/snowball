import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useLocation } from "wouter";
import { Snowflake } from "lucide-react";

export function Header() {
  const [location, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setLocation("/how-it-works")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-how-it-works"
          >
            How It Works
          </button>
          <button 
            onClick={() => setLocation("/about-us")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-about-us"
          >
            About Us
          </button>
        </nav>
        
        <button 
          onClick={() => setLocation("/")}
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
        >
          <Snowflake className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">Snowball</span>
        </button>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button 
            onClick={() => setLocation("/onboarding")} 
            data-testid="button-start-planning"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
