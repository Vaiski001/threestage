
interface CustomerStat {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

interface CustomerStatsProps {
  stats: CustomerStat[];
}

export const CustomerStats = ({ stats }: CustomerStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((card, i) => (
        <div key={i} className="glass-card rounded-lg p-6">
          <div className="text-muted-foreground mb-2">{card.label}</div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold">{card.value}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              card.changeType === "positive" 
                ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/30" 
                : card.changeType === "negative"
                  ? "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30"
                  : "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/30"
            }`}>
              {card.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
