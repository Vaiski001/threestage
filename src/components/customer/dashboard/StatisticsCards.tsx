
import { Card, CardContent } from "@/components/ui/card";

interface StatisticsProps {
  stats: {
    total: number;
    pending: number;
    completed: number;
  };
}

export function StatisticsCards({ stats }: StatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Enquiries</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Enquiries</h3>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Completed Enquiries</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
        </CardContent>
      </Card>
    </div>
  );
}
