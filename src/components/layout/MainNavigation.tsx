
import { Link } from "react-router-dom";

export function MainNavigation() {
  return (
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
  );
}
