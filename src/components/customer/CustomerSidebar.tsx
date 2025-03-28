
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Sidebar,
  SidebarContent,
  SidebarNavItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChevronDown, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  path?: string;
  children?: NavigationItem[];
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNavItemClick = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      toggleGroup(item.id);
      return;
    }
    
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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeNavItem === item.id}
                    onClick={() => handleNavItemClick(item)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.children && item.children.length > 0 && (
                      <ChevronDown 
                        className={`ml-auto h-4 w-4 transition-transform ${
                          expandedGroups[item.id] ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </SidebarMenuButton>
                  {item.children && item.children.length > 0 && expandedGroups[item.id] && (
                    <div className="pl-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <SidebarMenuButton
                          key={child.id}
                          isActive={activeNavItem === child.id}
                          onClick={() => {
                            if (child.path) {
                              navigate(child.path);
                            } else {
                              setActiveNavItem(child.id);
                            }
                          }}
                          size="sm"
                        >
                          {child.icon}
                          <span>{child.label}</span>
                        </SidebarMenuButton>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
