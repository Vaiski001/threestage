import React, { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { SidebarNav } from "../dashboards/SidebarNav";
import { ModeToggle } from "../theme/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { profile, logout } = useAuth();

  // Admin sidebar navigation items
  const sidebarNavItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: "LayoutDashboard"
    },
    {
      title: "Companies",
      href: "/admin/companies",
      icon: "Building"
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: "Users"
    },
    {
      title: "Inquiries",
      href: "/admin/inquiries",
      icon: "MessageSquare"
    },
    {
      title: "Forms",
      href: "/admin/forms",
      icon: "FileText"
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: "Settings"
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 bottom-0 w-64 bg-background border-r border-border">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold tracking-tight">Threestage Admin</h2>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <SidebarNav items={sidebarNavItems} />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6">
          <div>
            {/* Breadcrumb or page title could go here */}
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "Admin User"} />
                    <AvatarFallback>{profile?.name?.[0] || "A"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 