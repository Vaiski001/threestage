
import { useState, useEffect } from "react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";

export default function Enquiries() {
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();
  const location = useLocation();
  
  // Determine if this is a company or customer view based on route
  const isCompanyView = location.pathname.includes('/company/');
  const isCustomerView = location.pathname.includes('/customer/');
  
  // Set page title based on view
  const pageTitle = isCompanyView 
    ? "Enquiry Management" 
    : isCustomerView 
      ? "My Enquiries" 
      : "Enquiries";

  return (
    <div className="min-h-screen">
      <Header />
      <Container>
        <div className="pt-8 pb-20">
          <h1 className="text-3xl font-bold mb-8">{pageTitle}</h1>
          
          <KanbanBoard 
            readOnly={isCustomerView} 
            isCompanyView={isCompanyView}
          />
        </div>
      </Container>
    </div>
  );
}
