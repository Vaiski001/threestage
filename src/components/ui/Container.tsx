import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({ 
  children, 
  className, 
  size = "default" 
}: ContainerProps) {
  const sizeClasses = {
    default: "max-w-7xl",
    sm: "max-w-3xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };
  
  return (
    <div className={cn(
      "container mx-auto px-4 md:px-6", 
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}
