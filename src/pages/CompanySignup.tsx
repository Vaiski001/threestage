
import { Header } from "@/components/layout/Header";
import { CompanySignupForm } from "@/components/auth/CompanySignupForm";
import { Container } from "@/components/ui/Container";

export default function CompanySignup() {
  return (
    <>
      <Header />
      <main className="py-16">
        <Container size="sm">
          <CompanySignupForm />
        </Container>
      </main>
    </>
  );
}
