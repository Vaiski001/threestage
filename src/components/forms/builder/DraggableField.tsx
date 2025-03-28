
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FormField } from "@/lib/supabase/types";
import { ArrowUp, ArrowDown, Trash2, Grip } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { FieldEditor } from "./FieldEditor";

interface DraggableFieldProps {
  field: FormField;
  index: number;
  moveFieldUp: (index: number) => void;
  moveFieldDown: (index: number) => void;
  prepareDeleteField: (fieldId: string) => void;
  updateField: (fieldId: string, property: keyof FormField, value: any) => void;
  updateFieldOption: (fieldId: string, index: number, value: string) => void;
  addFieldOption: (fieldId: string) => void;
  removeFieldOption: (fieldId: string, index: number) => void;
  fieldsLength: number;
}

export function DraggableField({
  field,
  index,
  moveFieldUp,
  moveFieldDown,
  prepareDeleteField,
  updateField,
  updateFieldOption,
  addFieldOption,
  removeFieldOption,
  fieldsLength
}: DraggableFieldProps) {
  return (
    <Draggable key={field.id} draggableId={field.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="border rounded-md p-4 relative"
        >
          <div className="flex justify-between items-start mb-4">
            <div 
              {...provided.dragHandleProps}
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Grip className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => moveFieldUp(index)}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => moveFieldDown(index)}
                disabled={index === fieldsLength - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => prepareDeleteField(field.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`field-${field.id}`}>
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{field.label || 'Untitled Field'}</span>
                  <span className="text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5">
                    {field.type}
                  </span>
                  {field.required && (
                    <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded px-2 py-0.5">
                      Required
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <FieldEditor 
                  field={field}
                  updateField={updateField}
                  updateFieldOption={updateFieldOption}
                  addFieldOption={addFieldOption}
                  removeFieldOption={removeFieldOption}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </Draggable>
  );
}
