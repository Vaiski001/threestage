
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { CustomerWorkPartnersSidebar } from "@/components/customer/CustomerWorkPartnersSidebar";
import { WorkPartnersSidebar } from "@/components/common/WorkPartnersSidebar";
import { CustomerHeader } from "@/components/customer/CustomerHeader";
import { SidebarNavigation } from "@/components/navigation/SidebarNavigation";
import { UserProfileSection } from "@/components/navigation/UserProfileSection";
import { customerNavigationItems } from "@/components/customer/CustomerNavigationItems";
import { companyNavigationItems } from "@/components/company/CompanyNavigationItems";
import { Building, User } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { profile } = useAuth();
  const location = useLocation();
  
  // Determine user role from profile or from the current path as fallback
  const userRole = profile?.role || (location.pathname.startsWith('/company/') ? "company" : "customer");
  const isCompany = userRole === "company";

  // Get the appropriate navigation items based on user role
  const navigationItems = isCompany ? companyNavigationItems : customerNavigationItems;

  // Dummy handler for the new enquiry button in the header
  const handleNewEnquiry = () => {
    window.location.href = '/customer/enquiries';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            {isCompany ? (
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                <h1 className="font-semibold">Company Portal</h1>
              </div>
            ) : (
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                <h1 className="font-semibold">Customer Portal</h1>
              </div>
            )}
          </div>
          <SidebarContent>
            <SidebarNavigation navigationItems={navigationItems} />
          </SidebarContent>
          <UserProfileSection profile={profile} isCompany={isCompany} />
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {!isCompany && <CustomerHeader onNewEnquiry={handleNewEnquiry} />}
          {children}
        </div>
        
        {isCompany ? (
          <WorkPartnersSidebar />
        ) : (
          <CustomerWorkPartnersSidebar />
        )}
      </div>
    </SidebarProvider>
  );
};
