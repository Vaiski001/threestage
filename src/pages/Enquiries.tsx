
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Enquiries() {
  const { profile } = useAuth();

  return (
    <ProtectedRoute>
      <Header />
      <main className="py-12">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Enquiries</h1>
            <p className="text-muted-foreground">
              Submit and track your enquiries here
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-4">No enquiries yet</h3>
            <p className="text-muted-foreground mb-8">
              Get started by submitting your first enquiry
            </p>
            <Button>New Enquiry</Button>
          </div>
        </Container>
      </main>
    </ProtectedRoute>
  );
}
