import { useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  FileText, 
  MessageCircle, 
  User, 
  Bell, 
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface CustomerPortalLayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

export function CustomerPortalLayout({ children }: CustomerPortalLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { 
      path: "/customer/dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      path: "/customer/enquiries", 
      label: "My Inquiries", 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      path: "/customer/messaging/inbox", 
      label: "Messages", 
      icon: <MessageCircle className="h-5 w-5" /> 
    },
    { 
      path: "/customer/notifications", 
      label: "Notifications", 
      icon: <Bell className="h-5 w-5" /> 
    },
    { 
      path: "/customer/support", 
      label: "Support", 
      icon: <HelpCircle className="h-5 w-5" /> 
    },
    { 
      path: "/customer/profile", 
      label: "Profile", 
      icon: <User className="h-5 w-5" /> 
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const userName = profile?.name || "User";
  const userInitials = userName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header for all viewports */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="lg:hidden">
              <div className="grid gap-2 py-6">
                <div className="flex items-center gap-2 mb-8">
                  <span className="text-lg font-semibold">Customer Portal</span>
                  <X 
                    className="ml-auto h-5 w-5 cursor-pointer" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                  />
                </div>
                <nav className="grid gap-1">
                  {navItems.map((item, index) => (
                    <Button
                      key={index}
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-xl font-semibold hidden md:block">Customer Portal</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open user menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatarUrl || ""} alt={userName} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/customer/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/customer/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content area with sidebar for larger screens */}
      <div className="flex flex-1">
        {/* Desktop sidebar navigation */}
        <aside className="hidden lg:flex border-r w-64 flex-col">
          <div className="flex flex-col gap-2 p-4">
            <nav className="grid gap-1 px-2 text-sm font-medium">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 px-6 flex justify-between items-center text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} ThreeStage. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </footer>
    </div>
  );
} 