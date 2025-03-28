
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FormHeaderProps {
  onCreateNew: () => void;
}

export function FormHeader({ onCreateNew }: FormHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <h1 className="text-2xl font-bold">Form Management</h1>
      <Button onClick={onCreateNew}>
        <Plus className="mr-2 h-4 w-4" />
        Create New Form
      </Button>
    </div>
  );
}
