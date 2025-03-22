
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/context/AuthContext";
import { MainNavigation } from "./MainNavigation";
import { AccountDropdown } from "./AccountDropdown";
import { AuthButtons } from "./AuthButtons";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { isAuthenticated, profile } = useAuth();

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

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <AccountDropdown profile={profile} />
            ) : (
              <AuthButtons />
            )}
            <MobileMenu isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </Container>
    </header>
  );
}
