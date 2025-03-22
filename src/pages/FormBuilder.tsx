
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { FormManagement } from "@/components/forms/FormManagement";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarNavItem
} from "@/components/ui/sidebar";
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  User,
  Building,
  LayoutDashboard,
  Receipt,
  DollarSign,
  PieChart,
  UserPlus,
  FormInput,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function FormBuilder() {
  const [activeNavItem, setActiveNavItem] = useState("forms");
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Company sidebar navigation items
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Overview of key stats and activities" },
    { id: "enquiries", label: "Enquiries", icon: <MessageSquare className="h-5 w-5" />, description: "View and manage customer enquiries" },
    { id: "customers", label: "Customers", icon: <Users className="h-5 w-5" />, description: "List of customers with their details" },
    { id: "forms", label: "Form Builder", icon: <FormInput className="h-5 w-5" />, description: "Create and manage forms" },
    { id: "invoices", label: "Invoices", icon: <Receipt className="h-5 w-5" />, description: "Manage invoices and billing" },
    { id: "payments", label: "Payments", icon: <DollarSign className="h-5 w-5" />, description: "Track payments and transactions" },
    { id: "reports", label: "Reports & Analytics", icon: <PieChart className="h-5 w-5" />, description: "Insights and trends" },
    { id: "team", label: "Team Management", icon: <UserPlus className="h-5 w-5" />, description: "Manage company users and roles" },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, description: "Configure company details and preferences" }
  ];

  const handleNavigation = (id: string) => {
    if (id === "dashboard") {
      navigate("/company/dashboard");
    } else if (id === "enquiries") {
      navigate("/enquiries");
    } else {
      setActiveNavItem(id);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <Building className="h-5 w-5 mr-2" />
            <h1 className="font-semibold">Company Portal</h1>
          </div>
          <SidebarContent>
            <div className="space-y-1 py-4">
              {navigationItems.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  description={item.description}
                  isActive={activeNavItem === item.id}
                  onClick={handleNavigation}
                />
              ))}
            </div>
          </SidebarContent>
          <div className="border-t border-sidebar-border px-3 py-4 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{profile?.company_name || profile?.name || 'Company User'}</p>
                  <p className="text-xs text-sidebar-foreground/70">Company</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="relative hidden sm:block">
                <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 text-sm rounded-md bg-secondary/50 focus:bg-secondary border-0 focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="pt-8 pb-4 px-4 sm:px-6">
              <Container size="full">
                <FormManagement />
              </Container>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
