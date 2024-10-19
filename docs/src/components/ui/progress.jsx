import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "../../lib/utils"

const ProgressRoot = React.forwardRef(({ className, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  />
))
ProgressRoot.displayName = ProgressPrimitive.Root.displayName

const ProgressIndicator = React.forwardRef(({ className, ...props }, ref) => (
  <ProgressPrimitive.Indicator
    ref={ref}
    className={cn(
      "h-full w-full flex-1 bg-primary transition-all",
      className
    )}
    {...props}
  />
))
ProgressIndicator.displayName = ProgressPrimitive.Indicator.displayName

const Progress = React.forwardRef(({ 
  className, 
  value, 
  max = 100,
  size = "default",
  color = "primary",
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClasses = {
    small: "h-2",
    default: "h-4",
    large: "h-6"
  }

  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent"
  }

  return (
    <ProgressRoot
      ref={ref}
      className={cn(sizeClasses[size], "w-full", className)}
      {...props}
    >
      <ProgressIndicator
        className={cn(colorClasses[color])}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressRoot>
  )
})
Progress.displayName = "Progress"

export { Progress, ProgressRoot, ProgressIndicator }
