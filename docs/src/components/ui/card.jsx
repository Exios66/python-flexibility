import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef(({ className, variant = "default", size = "md", hover = false, ...props }, ref) => {
  const baseClasses = "rounded-lg border bg-card text-card-foreground shadow-sm"
  const variantClasses = {
    default: "",
    outline: "border-2",
    elevated: "shadow-md",
  }
  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  }
  const hoverClasses = hover ? "transition-shadow duration-300 hover:shadow-lg" : ""

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        hoverClasses,
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, align = "left", ...props }, ref) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", alignClasses[align], className)}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, as = "h3", ...props }, ref) => {
  const Component = as

  return (
    <Component
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, padding = "default", ...props }, ref) => {
  const paddingClasses = {
    default: "p-6 pt-0",
    none: "",
    sm: "p-3 pt-0",
    lg: "p-8 pt-0",
  }

  return (
    <div 
      ref={ref} 
      className={cn(paddingClasses[padding], className)} 
      {...props} 
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, justify = "start", ...props }, ref) => {
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", justifyClasses[justify], className)}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
