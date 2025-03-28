
import { FormCardGrid } from "./FormCardGrid";
import { FormSearchInput } from "./FormSearchInput";
import { FormTemplate } from "@/lib/supabase/types";

interface FormsTabContentProps {
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredForms: FormTemplate[];
  onEdit: (form: FormTemplate) => void;
  onPreview: (form: FormTemplate) => void;
  onDuplicate: (form: FormTemplate) => void;
  onShowIntegration: (form: FormTemplate) => void;
  onDelete: (formId: string) => void;
  onToggleActive: (formId: string, currentStatus: boolean) => void;
}

export function FormsTabContent({
  isLoading,
  searchQuery,
  setSearchQuery,
  filteredForms,
  onEdit,
  onPreview,
  onDuplicate,
  onShowIntegration,
  onDelete,
  onToggleActive
}: FormsTabContentProps) {
  return (
    <div className="space-y-4">
      <FormSearchInput 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <FormCardGrid
        isLoading={isLoading}
        forms={filteredForms}
        onEdit={onEdit}
        onPreview={onPreview}
        onDuplicate={onDuplicate}
        onShowIntegration={onShowIntegration}
        onDelete={onDelete}
        onToggleActive={onToggleActive}
      />
    </div>
  );
}
