
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

interface MobileMenuProps {
  isAuthenticated: boolean;
}

export function MobileMenu({ isAuthenticated }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
        <div className="pt-4 pb-2 border-t mt-4">
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
          </nav>
        </div>
      )}
    </div>
  );
}
