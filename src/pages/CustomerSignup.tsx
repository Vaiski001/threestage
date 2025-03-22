
import { Header } from "@/components/layout/Header";
import { CustomerSignupForm } from "@/components/auth/CustomerSignupForm";
import { Container } from "@/components/ui/Container";

export default function CustomerSignup() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <Container size="sm">
          <CustomerSignupForm />
        </Container>
      </main>
    </div>
  );
}
