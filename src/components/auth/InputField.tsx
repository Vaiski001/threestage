import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface InputFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  optional?: boolean;
  disabled?: boolean;
}

export function InputField({
  form,
  name,
  label,
  placeholder = "",
  type = "text",
  optional = false,
  disabled = false,
}: InputFieldProps) {
  const id = `field-${name}`;
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={id}>
            {label} {optional && <span className="text-muted-foreground text-xs">(Optional)</span>}
          </FormLabel>
          <FormControl>
            <Input 
              id={id}
              type={type}
              placeholder={placeholder}
              {...field} 
              disabled={disabled}
              aria-required={!optional}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
