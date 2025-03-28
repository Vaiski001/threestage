
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Analytics</CardTitle>
        <CardDescription>View statistics about your forms and submissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-muted-foreground">Form analytics will be implemented in a future update.</p>
      </CardContent>
    </Card>
  );
}
