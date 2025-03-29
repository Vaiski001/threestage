
import { Card, CardContent } from "@/components/ui/card";

interface CustomerDashboardHeaderProps {
  userName: string;
}

export function CustomerDashboardHeader({ userName }: CustomerDashboardHeaderProps) {
  return (
    <Card className="bg-slate-50 dark:bg-slate-900 border-none">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">Manage your enquiries, payments, and support easily.</p>
      </CardContent>
    </Card>
  );
}
