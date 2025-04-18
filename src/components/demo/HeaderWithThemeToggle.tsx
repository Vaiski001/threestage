import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"
import { Button } from "@/components/ui/button"
import { LogIn, Menu } from "lucide-react"

export function HeaderWithThemeToggle() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">ThreeStage</span>
          </a>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Button variant="ghost" size="sm" className="mx-2">
              Features
            </Button>
            <Button variant="ghost" size="sm" className="mx-2">
              About
            </Button>
            <Button variant="ghost" size="sm" className="mx-2">
              Contact
            </Button>
          </nav>
          
          <div className="flex items-center space-x-2">
            <ThemeToggleButton />
            <Button size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 