
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormField, FormFieldType } from "@/lib/supabase/types";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { FieldTypeButtons } from "./FieldTypeButtons";
import { DraggableField } from "./DraggableField";

interface FieldsTabContentProps {
  fields: FormField[];
  onAddField: (type: FormFieldType) => void;
  onDragEnd: (result: DropResult) => void;
  moveFieldUp: (index: number) => void;
  moveFieldDown: (index: number) => void;
  prepareDeleteField: (fieldId: string) => void;
  updateField: (fieldId: string, property: keyof FormField, value: any) => void;
  updateFieldOption: (fieldId: string, index: number, value: string) => void;
  addFieldOption: (fieldId: string) => void;
  removeFieldOption: (fieldId: string, index: number) => void;
}

export function FieldsTabContent({
  fields,
  onAddField,
  onDragEnd,
  moveFieldUp,
  moveFieldDown,
  prepareDeleteField,
  updateField,
  updateFieldOption,
  addFieldOption,
  removeFieldOption
}: FieldsTabContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Form Fields</CardTitle>
        <CardDescription>Drag and drop fields to build your form</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldTypeButtons onAddField={onAddField} />

        {fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">Add fields to your form by clicking the buttons above</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {fields.map((field, index) => (
                    <DraggableField
                      key={field.id}
                      field={field}
                      index={index}
                      moveFieldUp={moveFieldUp}
                      moveFieldDown={moveFieldDown}
                      prepareDeleteField={prepareDeleteField}
                      updateField={updateField}
                      updateFieldOption={updateFieldOption}
                      addFieldOption={addFieldOption}
                      removeFieldOption={removeFieldOption}
                      fieldsLength={fields.length}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </CardContent>
    </Card>
  );
}
