import { Mail, Clock, PlusCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnquiryStatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  trend?: number;
  trendDirection?: "up" | "down" | "neutral";
  className?: string;
}

function EnquiryStatsCard({ 
  title, 
  count, 
  icon, 
  trend, 
  trendDirection = "neutral",
  className 
}: EnquiryStatsCardProps) {
  return (
    <div className={cn(
      "rounded-lg p-4 flex flex-col h-full shadow-sm",
      className
    )}>
      <div className="flex items-center mb-2 text-lg font-semibold">
        <span className="mr-2">{icon}</span>
        <h3>{title}</h3>
      </div>
      <div className="text-3xl font-bold mb-2">{count}</div>
      {trend !== undefined && (
        <div className="flex items-center text-sm mt-auto">
          <span className={cn(
            "inline-flex items-center",
            trendDirection === "up" ? "text-green-600" : "",
            trendDirection === "down" ? "text-red-600" : "",
            trendDirection === "neutral" ? "text-blue-600" : ""
          )}>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              className="mr-1"
            >
              {trendDirection === "up" && (
                <path d="M8 4L12 8L10.6 9.4L8.5 7.3V12H7.5V7.3L5.4 9.4L4 8L8 4Z" fill="currentColor" />
              )}
              {trendDirection === "down" && (
                <path d="M8 12L4 8L5.4 6.6L7.5 8.7V4H8.5V8.7L10.6 6.6L12 8L8 12Z" fill="currentColor" />
              )}
              {trendDirection === "neutral" && (
                <path d="M4 8H12" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
            {trend}%
          </span>
        </div>
      )}
    </div>
  );
}

interface EnquiryStatsProps {
  totalEnquiries: number;
  pendingEnquiries: number;
  newEnquiries: number;
  resolvedEnquiries: number;
  totalTrend?: number;
  pendingTrend?: number;
  newTrend?: number;
  resolvedTrend?: number;
}

export function EnquiryStats({
  totalEnquiries,
  pendingEnquiries,
  newEnquiries,
  resolvedEnquiries,
  totalTrend,
  pendingTrend,
  newTrend,
  resolvedTrend
}: EnquiryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <EnquiryStatsCard
        title="Total Enquiries"
        count={totalEnquiries}
        icon={<Mail className="h-5 w-5" />}
        trend={totalTrend}
        trendDirection="up"
        className="bg-blue-50 text-blue-700 border border-blue-100"
      />
      <EnquiryStatsCard
        title="Pending"
        count={pendingEnquiries}
        icon={<Clock className="h-5 w-5" />}
        trend={pendingTrend}
        trendDirection="up"
        className="bg-yellow-50 text-yellow-700 border border-yellow-100"
      />
      <EnquiryStatsCard
        title="New Enquiries"
        count={newEnquiries}
        icon={<PlusCircle className="h-5 w-5" />}
        trend={newTrend}
        trendDirection="up"
        className="bg-purple-50 text-purple-700 border border-purple-100"
      />
      <EnquiryStatsCard
        title="Resolved"
        count={resolvedEnquiries}
        icon={<CheckCircle className="h-5 w-5" />}
        trend={resolvedTrend}
        trendDirection="up"
        className="bg-green-50 text-green-700 border border-green-100"
      />
    </div>
  );
} 