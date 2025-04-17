import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  BarChart3,
  Settings,
  Code,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  title: string;
  href: string;
  icon: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { pathname } = useLocation();
  const { resetAuth } = useAuth();

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: "Companies",
      href: "/admin/companies",
      icon: <Building2 className="h-5 w-5" />
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Moderation",
      href: "/admin/moderation",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    },
    {
      title: "Dev Tools",
      href: "/admin/dev-tools",
      icon: <Code className="h-5 w-5" />
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Admin Portal</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                pathname === item.href
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
          <div className="mt-auto pt-4 border-t mt-8">
            <Button 
              variant="outline" 
              className="w-full justify-start text-muted-foreground"
              onClick={() => resetAuth()}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
} 