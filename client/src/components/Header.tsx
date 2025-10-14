import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "wouter";
import { Snowflake, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogin = (returnTo?: string) => {
    const returnPath = returnTo || window.location.pathname;
    window.location.href = `/api/login?returnTo=${encodeURIComponent(returnPath)}`;
  };

  const handleGetStarted = () => {
    window.location.href = `/api/login?returnTo=${encodeURIComponent('/onboarding')}`;
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

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

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {!isLoading && !isAuthenticated && (
            <>
              <Button 
                variant="ghost" 
                onClick={handleLogin}
                data-testid="button-login"
              >
                Log In
              </Button>
              <Button 
                onClick={handleGetStarted} 
                data-testid="button-start-planning"
              >
                Get Started
              </Button>
            </>
          )}

          {isAuthenticated && user && (
            <>
              <Button onClick={() => setLocation("/onboarding")} data-testid="button-start-planning">
                Start Planning
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImageUrl || undefined} alt={user.email || "User"} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  data-testid="button-logout"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
