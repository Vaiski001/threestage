
import { useState } from "react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";

export default function Enquiries() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen">
      <Header />
      <Container>
        <div className="pt-8 pb-20">
          <h1 className="text-3xl font-bold mb-8">Enquiries</h1>
          
          <KanbanBoard />
        </div>
      </Container>
    </div>
  );
}
