
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Plus } from "lucide-react";

interface DashboardSectionProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  actionButtonText?: string;
  onActionClick?: () => void;
}

export const DashboardSection = ({
  title,
  subtitle,
  children,
  actionButtonText,
  onActionClick
}: DashboardSectionProps) => {
  return (
    <Container size="full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        {actionButtonText && onActionClick && (
          <Button onClick={onActionClick}>
            <Plus className="h-4 w-4 mr-2" />
            {actionButtonText}
          </Button>
        )}
      </div>
      {children}
    </Container>
  );
};
