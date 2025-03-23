
import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormLabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, htmlFor, ...props }, ref) => {
    return (
      <Label
        ref={ref}
        htmlFor={htmlFor}
        className={cn("text-base font-medium mb-2 block", className)}
        {...props}
      >
        {children}
      </Label>
    )
  }
)
FormLabel.displayName = "FormLabel"

export { FormLabel }
