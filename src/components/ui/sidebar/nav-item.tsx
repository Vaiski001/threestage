
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export function SidebarNavItem({ 
  id, 
  label, 
  icon, 
  description, 
  isActive, 
  onClick 
}: SidebarNavItemProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-200",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      {icon}
      <div className="flex flex-col items-start">
        <span>{label}</span>
        {description && (
          <span className="text-xs text-sidebar-foreground/70 hidden sm:inline-block">
            {description}
          </span>
        )}
      </div>
    </button>
  );
}
