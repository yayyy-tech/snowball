import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useLocation } from "wouter";
import { Snowflake, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between md:grid md:grid-cols-3">
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
            className="flex items-center gap-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md justify-self-center"
          >
            <Snowflake className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Snowball</span>
          </button>

          <div className="flex items-center gap-3 justify-self-end">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLocation("/previous-plans")}
                  className="hidden md:inline-flex"
                  data-testid="button-previous-plans"
                >
                  Previous Plans
                </Button>
                {user && (
                  <div className="flex items-center gap-2" data-testid="user-profile">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || 'User'} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">{user.firstName || 'User'}</span>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => logout()}
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => login()}
                data-testid="button-login"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
            <Button 
              onClick={() => setLocation("/onboarding")} 
              data-testid="button-start-planning"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
