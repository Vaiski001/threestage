
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

interface MobileMenuProps {
  isAuthenticated: boolean;
}

export function MobileMenu({ isAuthenticated }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };
  
  return (
    <div className="md:hidden">
      <button
        className="flex items-center"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      
      {isMenuOpen && (
        <div className="absolute top-16 right-0 left-0 z-50 bg-background border-b shadow-lg pt-4 pb-2 px-4">
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
                <button
                  className="py-2 text-left text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => handleNavigation("/login")}
                >
                  Log in
                </button>
                <button
                  className="py-2 text-left text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => handleNavigation("/signup-customer")}
                >
                  Sign up as Customer
                </button>
                <button
                  className="py-2 text-left text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => handleNavigation("/signup-company")}
                >
                  Sign up as Company
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
