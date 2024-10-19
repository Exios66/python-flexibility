import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      size: {
        default: "text-sm",
        large: "text-base",
        small: "text-xs",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        bold: "font-bold",
      },
      color: {
        default: "text-gray-700",
        primary: "text-blue-600",
        secondary: "text-gray-500",
      },
    },
    defaultVariants: {
      size: "default",
      weight: "medium",
      color: "default",
    },
  }
)

const Label = React.forwardRef(({ className, size, weight, color, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ size, weight, color }), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }
