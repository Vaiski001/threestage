
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { signOut, forceSignOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, ChevronDown, RefreshCcw } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === "/";
  
  // Show auth buttons if:
  // 1. User is NOT authenticated, OR
  // 2. User IS authenticated but we're NOT on the homepage
  const showAuthButtons = !isAuthenticated || !isHomePage;
  
  // For the homepage, we always want to show login/signup if not authenticated
  const showLoginSignup = isHomePage && !isAuthenticated;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out and all credentials have been cleared.",
      });
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out completely. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleForceSignOut = async () => {
    try {
      await forceSignOut();
      toast({
        title: "Force signed out",
        description: "All authentication data has been cleared.",
      });
    } catch (error) {
      console.error("Force sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to force sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="py-4 border-b">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold mr-8">
              LeadOrganizer
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link to="#contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && !isHomePage ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {profile?.company_name || profile?.name || "Account"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{profile?.name || profile?.company_name}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {profile?.role === "company" ? (
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate("/enquiries")}>My Enquiries</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleForceSignOut} className="text-destructive">
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Force sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              showAuthButtons && (
                <>
                  <Button variant="outline" className="hidden sm:flex gap-2" onClick={handleForceSignOut}>
                    <RefreshCcw className="h-4 w-4" />
                    <span>Reset Auth</span>
                  </Button>
                  <div className="hidden sm:block">
                    <Button variant="outline" onClick={() => navigate("/login")}>
                      Log in
                    </Button>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        Sign up
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => navigate("/signup-customer")}>
                        As Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/signup-company")}>
                        As Company
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )
            )}

            {/* For homepage only: Always show login/signup if not authenticated */}
            {showLoginSignup && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <Button variant="outline" onClick={() => navigate("/login")}>
                    Log in
                  </Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      Sign up
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigate("/signup-customer")}>
                      As Customer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/signup-company")}>
                      As Company
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t mt-4">
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="#features"
                className="py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="#pricing"
                className="py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="#contact"
                className="py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="py-2 text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup-customer"
                    className="py-2 text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up as Customer
                  </Link>
                  <Link
                    to="/signup-company"
                    className="py-2 text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up as Company
                  </Link>
                </>
              )}
              {!isAuthenticated && (
                <Button 
                  variant="ghost" 
                  className="justify-start px-0 text-sm font-medium hover:text-primary transition-colors"
                  onClick={handleForceSignOut}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Reset Auth
                </Button>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
