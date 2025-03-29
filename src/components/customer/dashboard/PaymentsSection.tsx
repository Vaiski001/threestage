
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface PaymentInfo {
  amount: string;
  dueDate: string;
  daysRemaining: number;
  invoiceNumber: string;
  billingPlan: string;
  billingCycle: string;
  paymentMethod: string;
  cardLastFour?: string;
}

export function PaymentsSection() {
  // Empty state for a new account - no payment info available
  const paymentInfo: PaymentInfo | null = null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-bold">Upcoming Payments</CardTitle>
        {paymentInfo && (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/customer/billing" className="flex items-center text-xs">
              Go to Billing
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {paymentInfo ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Next payment due</h3>
                <Badge 
                  variant={paymentInfo.daysRemaining <= 3 ? "destructive" : "outline"}
                  className="text-xs"
                >
                  Due in {paymentInfo.daysRemaining} days
                </Badge>
              </div>
              
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">{paymentInfo.amount}</span>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {paymentInfo.dueDate}
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Invoice #{paymentInfo.invoiceNumber}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Billing Status</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Plan</span>
                <span className="font-medium">{paymentInfo.billingPlan}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Billing Cycle</span>
                <span>{paymentInfo.billingCycle}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <div className="flex items-center">
                  <CreditCard className="h-3 w-3 mr-1" />
                  <span>{paymentInfo.paymentMethod} {paymentInfo.cardLastFour && `ending in ${paymentInfo.cardLastFour}`}</span>
                </div>
              </div>
            </div>
            
            <Button className="w-full" asChild>
              <Link to="/customer/billing">
                Go to Billing
              </Link>
            </Button>
          </div>
        ) : (
          <div className="py-8 text-center">
            <CreditCard className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground mb-1">No billing information available</p>
            <p className="text-xs text-muted-foreground/70 mb-4">
              Billing information will appear once you've been invoiced for services
            </p>
            
            <Button variant="outline" size="sm" asChild>
              <Link to="/customer/billing">
                Set up billing details
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
