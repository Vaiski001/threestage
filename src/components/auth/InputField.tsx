
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
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {optional && <span className="text-muted-foreground text-xs">(Optional)</span>}
          </FormLabel>
          <FormControl>
            <Input 
              type={type}
              placeholder={placeholder}
              {...field} 
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
