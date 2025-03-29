
import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { CompanyRoutes } from "./CompanyRoutes";
import { CustomerRoutes } from "./CustomerRoutes";
import NotFound from "@/pages/NotFound";

export const AppRouter = () => {
  return (
    <Routes>
      <PublicRoutes />
      <CompanyRoutes />
      <CustomerRoutes />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
