import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "../../lib/utils"

const RadioGroup = React.forwardRef(({ className, orientation = "vertical", size = "default", ...props }, ref) => {
  const orientationClasses = {
    vertical: "grid gap-2",
    horizontal: "flex gap-4"
  }

  const sizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg"
  }

  return (
    <RadioGroupPrimitive.Root
      className={cn(orientationClasses[orientation], sizeClasses[size], className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef(({ className, children, size = "default", ...props }, ref) => {
  const sizeClasses = {
    small: "h-3 w-3",
    default: "h-4 w-4",
    large: "h-5 w-5"
  }

  const indicatorSizeClasses = {
    small: "h-1.5 w-1.5",
    default: "h-2.5 w-2.5",
    large: "h-3.5 w-3.5"
  }

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className={cn("fill-current text-current", indicatorSizeClasses[size])} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

const RadioGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
RadioGroupLabel.displayName = "RadioGroupLabel"

const RadioGroupDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
RadioGroupDescription.displayName = "RadioGroupDescription"

export { RadioGroup, RadioGroupItem, RadioGroupLabel, RadioGroupDescription }
