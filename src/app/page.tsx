import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-100 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">Threestage</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-foreground/70 hover:text-foreground transition-all duration-200">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-foreground/70 hover:text-foreground transition-all duration-200">
              Pricing
            </Link>
            <Link href="/about" className="text-sm text-foreground/70 hover:text-foreground transition-all duration-200">
              About
            </Link>
            <Link href="/contact" className="text-sm text-foreground/70 hover:text-foreground transition-all duration-200">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
              Log in
            </Link>
            <Link href="/signup" className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 transition-all duration-200">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Streamline your customer enquiries
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
            Threestage helps businesses manage customer inquiries efficiently, 
            boosting productivity and improving customer satisfaction.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md px-8 py-3 transition-all duration-200">
              Get started
            </Link>
            <Link href="/demo" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium rounded-md px-8 py-3 transition-all duration-200">
              View demo
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 dark:border-gray-800 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-semibold tracking-tight">Threestage</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="block text-xs">By Aviacore Technologies</span>
                Streamline your customer enquiries and boost your business efficiency.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/documentation" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground order-2 md:order-1">
              &copy; {currentYear} Threestage By Aviacore Technologies. All rights reserved.
            </p>
            
            <div className="flex gap-6 order-1 md:order-2">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
