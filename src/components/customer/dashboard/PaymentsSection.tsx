import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PaymentsSectionProps {
  emptyState?: boolean;
}

export function PaymentsSection({ emptyState = false }: PaymentsSectionProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Payments</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/customer/billing" className="flex items-center">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {emptyState ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No payments yet</h3>
            <p className="text-muted-foreground text-sm max-w-[200px] mb-4">
              Your recent payments and invoices will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-md">
              <div>
                <h3 className="font-medium">Next Payment</h3>
                <p className="text-sm text-muted-foreground">Invoice #INV-2023-003</p>
                <p className="text-xs text-muted-foreground">Due in 3 days</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$750.00</p>
                <Button size="sm" variant="outline" className="mt-2">Pay Now</Button>
              </div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Payment Summary</h3>
                <span className="text-xs text-muted-foreground">Last 30 days</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md">
                  <p className="text-xs text-muted-foreground">Paid</p>
                  <p className="font-bold">$2,000</p>
                </div>
                <div className="bg-muted p-2 rounded-md">
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="font-bold">$750</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
