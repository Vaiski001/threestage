
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { NavigationItem } from "../customer/CustomerNavigationItems";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SidebarNavigationProps {
  navigationItems: NavigationItem[];
}

export const SidebarNavigation = ({ navigationItems }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize expanded state based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const newExpandedState: Record<string, boolean> = {};
    
    navigationItems.forEach(item => {
      // Check if this is the active item
      if (item.path && currentPath === item.path) {
        // No need to expand if this is the active item without children
        if (item.children && item.children.length > 0) {
          newExpandedState[item.id] = true;
        }
      }
      // Check if any child of this item is active
      else if (item.children && item.children.some(child => 
        child.path && (child.path === currentPath || currentPath.startsWith(`${child.path}/`))
      )) {
        newExpandedState[item.id] = true;
      }
      // Check if the current path starts with the item path (for nested routes)
      else if (item.path && currentPath.startsWith(`${item.path}/`)) {
        if (item.children && item.children.length > 0) {
          newExpandedState[item.id] = true;
        }
      }
    });
    
    setExpandedGroups(prev => ({...prev, ...newExpandedState}));
  }, [location.pathname, navigationItems]);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNavigation = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      toggleGroup(item.id);
      // If the item has a path, also navigate to it
      if (item.path) {
        navigate(item.path);
      }
      return;
    }
    
    if (item.path) {
      navigate(item.path);
    }
  };

  // Filter navigation items based on search query
  const filteredNavItems = searchQuery.trim() === "" 
    ? navigationItems
    : navigationItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.children && item.children.some(child => 
          child.label.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm bg-sidebar-accent/50 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={location.pathname === item.path || (item.path && location.pathname.startsWith(`${item.path}/`))}
                onClick={() => handleNavigation(item)}
                className={cn(
                  "transition-all duration-200",
                  location.pathname === item.path ? "bg-sidebar-accent/80 text-primary font-medium" : ""
                )}
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
                      isActive={location.pathname === child.path || (child.path && location.pathname.startsWith(`${child.path}/`))}
                      onClick={() => {
                        if (child.path) {
                          navigate(child.path);
                        }
                      }}
                      size="sm"
                      className={cn(
                        "transition-all duration-200",
                        location.pathname === child.path ? "bg-sidebar-accent/80 text-primary font-medium" : ""
                      )}
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
      </div>
    </div>
  );
};
