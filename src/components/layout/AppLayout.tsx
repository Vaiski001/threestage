import { ReactNode, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";

import { CustomerWorkPartnersSidebar } from "@/components/customer/CustomerWorkPartnersSidebar";
import { WorkPartnersSidebar } from "@/components/common/WorkPartnersSidebar";
import { CustomerHeader } from "@/components/customer/CustomerHeader";
import { CompanyHeader } from "@/components/company/CompanyHeader";
import { SidebarNavigation } from "@/components/navigation/SidebarNavigation";
import { UserProfileSection } from "@/components/navigation/UserProfileSection";
import { customerNavigationItems } from "@/components/customer/CustomerNavigationItems";
import { companyNavigationItems } from "@/components/company/CompanyNavigationItems";

interface AppLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  showSearchBar?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  headerRightActions?: ReactNode;
}

export const AppLayout = ({ 
  children, 
  pageTitle,
  showSearchBar = true,
  searchPlaceholder,
  onSearch,
  headerRightActions 
}: AppLayoutProps) => {
  const { profile } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Determine if this is a public page (landing, login, signup, etc.)
  const publicPaths = ['/', '/login', '/signup', '/demo', '/unauthorized', '/auth/callback'];
  const isPublicPage = publicPaths.some(path => location.pathname === path);
  
  // Only show the portal UI on non-public pages
  if (isPublicPage) {
    return <>{children}</>;
  }
  
  // Determine user role from profile or from the current path as fallback
  const userRole = profile?.role || (location.pathname.startsWith('/company/') ? "company" : "customer");
  const isCompany = userRole === "company";

  // Get the appropriate navigation items based on user role
  const navigationItems = isCompany ? companyNavigationItems : customerNavigationItems;

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  // Action handlers
  const handleNewEnquiry = () => {
    window.location.href = '/customer/enquiries';
  };

  const handleNewForm = () => {
    window.location.href = '/company/forms/create';
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Left Sidebar - Navigation */}
      <div className="w-[250px] min-h-screen h-full bg-[#111827] flex flex-col flex-shrink-0">
        {/* Portal Brand */}
        <div className="h-16 flex items-center px-4 border-b border-gray-700">
          {isCompany ? (
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-sm bg-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-2">
                  A
                </div>
                <div>
                  <h1 className="text-xs font-medium tracking-wider text-white uppercase">Company Portal</h1>
                  <p className="text-[10px] text-white/50">Aviacore Technologies</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-sm bg-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-2">
                  A
                </div>
                <div>
                  <h1 className="text-xs font-medium tracking-wider text-white uppercase">Customer Portal</h1>
                  <p className="text-[10px] text-white/50">Aviacore Technologies</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto">
          <SidebarNavigation navigationItems={navigationItems} />
        </div>
        
        {/* User Profile */}
        <UserProfileSection profile={profile} isCompany={isCompany} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        {isCompany ? (
          <CompanyHeader 
            onNewForm={handleNewForm}
            searchPlaceholder={searchPlaceholder || "Search enquiries, forms, customers..."}
            onSearch={handleSearch}
            searchValue={searchQuery}
            rightActions={headerRightActions}
            showSearchBar={showSearchBar}
          />
        ) : (
          <CustomerHeader 
            onNewEnquiry={handleNewEnquiry}
            searchPlaceholder={searchPlaceholder || "Search..."}
            onSearch={handleSearch}
            searchValue={searchQuery}
            rightActions={headerRightActions}
            showSearchBar={showSearchBar}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
      
      {/* Right Sidebar - Work Partners */}
      {isCompany ? (
        <WorkPartnersSidebar isCompanyView={true} />
      ) : (
        <CustomerWorkPartnersSidebar />
      )}
    </div>
  );
};
