import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings,
  CreditCard,
  User,
  HelpCircle,
  Bell,
  PieChart
} from "lucide-react";

interface SidebarNavItem {
  title: string;
  href: string;
  icon: string;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const location = useLocation();
  
  // Map icon names to icon components
  const iconMap: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
    Building: <Building className="h-5 w-5" />,
    Users: <Users className="h-5 w-5" />,
    MessageSquare: <MessageSquare className="h-5 w-5" />,
    FileText: <FileText className="h-5 w-5" />,
    Settings: <Settings className="h-5 w-5" />,
    User: <User className="h-5 w-5" />,
    CreditCard: <CreditCard className="h-5 w-5" />,
    HelpCircle: <HelpCircle className="h-5 w-5" />,
    Bell: <Bell className="h-5 w-5" />,
    PieChart: <PieChart className="h-5 w-5" />
  };

  return (
    <nav className="space-y-1 px-2">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
        >
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 font-normal",
              location.pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {iconMap[item.icon] || <div className="h-5 w-5" />}
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  );
} 