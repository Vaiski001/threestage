
import { Header } from "@/components/layout/Header";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { Container } from "@/components/ui/Container";

export default function PasswordReset() {
  return (
    <>
      <Header />
      <main className="py-16">
        <Container size="sm">
          <PasswordResetForm />
        </Container>
      </main>
    </>
  );
}
