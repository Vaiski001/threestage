
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { NavigationItem } from "../customer/CustomerNavigationItems";

interface SidebarNavigationProps {
  navigationItems: NavigationItem[];
}

export const SidebarNavigation = ({ navigationItems }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNavigation = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      toggleGroup(item.id);
      return;
    }
    
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <SidebarMenu>
      {navigationItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            isActive={location.pathname === item.path || location.pathname.includes(`/${item.id}`)}
            onClick={() => handleNavigation(item)}
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
                  isActive={location.pathname === child.path}
                  onClick={() => {
                    if (child.path) {
                      navigate(child.path);
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
  );
};
