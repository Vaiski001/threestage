
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export const SupportSection = () => {
  return (
    <Container size="full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Support</h1>
          <p className="text-muted-foreground">Get help and contact customer service</p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2">Need help?</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Our support team is here to help you with any questions or issues.
        </p>
        <Button>Contact Support</Button>
      </div>
    </Container>
  );
};
