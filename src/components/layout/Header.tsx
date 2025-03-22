
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 glass-effect border-b border-gray-100 dark:border-gray-800 shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">Enquiry</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium transition-all-200 hover:text-primary/80">Home</Link>
            <Link to="/#features" className="text-sm font-medium transition-all-200 hover:text-primary/80">Features</Link>
            <Link to="/#pricing" className="text-sm font-medium transition-all-200 hover:text-primary/80">Pricing</Link>
            <Link to="/dashboard" className="text-sm font-medium transition-all-200 hover:text-primary/80">Dashboard</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>

          <button
            className="block md:hidden p-2 -mr-2 rounded-md text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden animate-fade-down mt-4 pb-4">
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-sm font-medium transition-all-200 hover:text-primary/80 py-2">Home</Link>
              <Link to="/#features" className="text-sm font-medium transition-all-200 hover:text-primary/80 py-2">Features</Link>
              <Link to="/#pricing" className="text-sm font-medium transition-all-200 hover:text-primary/80 py-2">Pricing</Link>
              <Link to="/dashboard" className="text-sm font-medium transition-all-200 hover:text-primary/80 py-2">Dashboard</Link>
              
              <div className="flex flex-col gap-3 mt-2">
                <Button variant="outline" size="sm" asChild className="justify-center">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90 justify-center" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
