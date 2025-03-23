
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerProfileDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new customer settings page
    navigate("/customer/settings", { replace: true });
  }, [navigate]);

  // This is just a fallback while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to customer settings...</p>
    </div>
  );
}
