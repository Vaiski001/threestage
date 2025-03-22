
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/context/AuthContext";
import { MainNavigation } from "./MainNavigation";
import { AccountDropdown } from "./AccountDropdown";
import { AuthButtons } from "./AuthButtons";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function Header() {
  const { isAuthenticated, profile, resetAuth } = useAuth();

  return (
    <header className="py-4 border-b">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold mr-8">
              LeadOrganizer
            </Link>
            <MainNavigation />
          </div>

          <div className="flex items-center gap-3">
            <Link to="/demo">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                <Play className="h-4 w-4" />
                See Demo
              </Button>
            </Link>
            {isAuthenticated && profile ? (
              <AccountDropdown profile={profile} />
            ) : (
              <AuthButtons />
            )}
            {/* Add debug button in development only */}
            {import.meta.env.DEV && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetAuth}
                className="text-xs hidden md:block"
              >
                Debug: Reset Auth
              </Button>
            )}
            <MobileMenu isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </Container>
    </header>
  );
}
