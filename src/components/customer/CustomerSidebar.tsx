
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Sidebar,
  SidebarContent,
  SidebarNavItem,
} from "@/components/ui/sidebar";
import { Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  path?: string;
}

interface CustomerSidebarProps {
  navigationItems: NavigationItem[];
  activeNavItem: string;
  setActiveNavItem: (id: string) => void;
}

export const CustomerSidebar = ({
  navigationItems,
  activeNavItem,
  setActiveNavItem
}: CustomerSidebarProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleNavItemClick = (item: NavigationItem) => {
    if (item.path) {
      navigate(item.path);
    } else {
      setActiveNavItem(item.id);
    }
  };

  return (
    <Sidebar variant="sidebar">
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <h1 className="font-semibold text-lg">Customer Portal</h1>
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
              onClick={() => handleNavItemClick(item)}
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
              <p className="text-sm font-medium">{profile?.name || 'Customer'}</p>
              <p className="text-xs text-sidebar-foreground/70">Customer</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-sidebar-foreground" onClick={() => navigate('/customer/settings')}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Sidebar>
  );
};
