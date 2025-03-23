
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, PlusCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  secondaryButtonText?: string;
  icon?: React.ReactNode;
  onButtonClick: () => void;
  onSecondaryButtonClick?: () => void;
}

export const EmptyState = ({
  title,
  description,
  buttonText,
  secondaryButtonText,
  icon = <MessageCircle className="h-8 w-8 text-primary" />,
  onButtonClick,
  onSecondaryButtonClick
}: EmptyStateProps) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-8 text-center my-6">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onButtonClick}>
          <Plus className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
        {secondaryButtonText && onSecondaryButtonClick && (
          <Button variant="outline" onClick={onSecondaryButtonClick}>
            {secondaryButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};
