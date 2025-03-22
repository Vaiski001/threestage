
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="py-24">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Access Denied</h1>
            <p className="text-xl text-muted-foreground mb-8">
              You don't have permission to access this page.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate(-1)}>Go Back</Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Return to Home
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
