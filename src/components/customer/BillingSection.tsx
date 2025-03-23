
import { Container } from "@/components/ui/Container";
import { CreditCard } from "lucide-react";

export const BillingSection = () => {
  return (
    <Container size="full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage your invoices and payment methods</p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2">No billing information</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          You don't have any invoices or payment methods set up yet.
        </p>
      </div>
    </Container>
  );
};
