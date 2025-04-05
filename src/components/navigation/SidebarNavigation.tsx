import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
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
      <div className="px-3 py-2 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm bg-white/10 border-none text-white placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/30"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="py-2">
          {filteredNavItems.map((item) => (
            <li key={item.id} className="mb-1">
              <button
                onClick={() => handleNavigation(item)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm transition-colors rounded-none",
                  "text-white/80 hover:text-white hover:bg-white/10",
                  location.pathname === item.path ? "bg-indigo-600 text-white font-medium" : ""
                )}
              >
                <span className="mr-3 text-[#6366F1]">{item.icon}</span>
                <span>{item.label}</span>
                {item.children && item.children.length > 0 && (
                  <ChevronDown 
                    className={`ml-auto h-4 w-4 transition-transform ${
                      expandedGroups[item.id] ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
              {item.children && item.children.length > 0 && expandedGroups[item.id] && (
                <ul className="pl-10 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <button
                        onClick={() => {
                          if (child.path) {
                            navigate(child.path);
                          }
                        }}
                        className={cn(
                          "flex items-center w-full px-3 py-1.5 text-sm transition-colors rounded-none",
                          "text-white/70 hover:text-white hover:bg-white/10",
                          location.pathname === child.path ? "bg-indigo-600/80 text-white font-medium" : ""
                        )}
                      >
                        <span className="mr-3 text-[#6366F1]">{child.icon}</span>
                        <span>{child.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
