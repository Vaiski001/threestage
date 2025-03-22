
import { Header } from "@/components/layout/Header";
import { LoginForm } from "@/components/auth/LoginForm";
import { Container } from "@/components/ui/Container";

export default function Login() {
  return (
    <>
      <Header />
      <main className="py-16">
        <Container size="sm">
          <LoginForm />
        </Container>
      </main>
    </>
  );
}
