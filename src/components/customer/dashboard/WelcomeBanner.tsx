
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeBannerProps {
  userName: string;
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  return (
    <Card className="bg-slate-50 dark:bg-slate-900 border-none">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">Manage your enquiries, payments, and support easily.</p>
      </CardContent>
    </Card>
  );
}
