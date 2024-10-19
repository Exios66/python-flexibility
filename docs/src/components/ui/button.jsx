import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",
        info: "bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        xl: "h-12 px-10 rounded-lg text-lg",
      },
      fullWidth: {
        true: "w-full",
      },
      animated: {
        true: "transition-transform duration-200 ease-in-out transform hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
      animated: false,
    },
  }
)

const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  fullWidth,
  animated,
  children,
  startIcon,
  endIcon,
  loading,
  loadingText = "Loading...",
  ...props 
}, ref) => {
  const buttonClasses = cn(
    buttonVariants({ variant, size, fullWidth, animated, className }),
    loading && "opacity-70 cursor-not-allowed"
  )

  return (
    <button
      className={buttonClasses}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="mr-2 inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
          {loadingText}
        </>
      ) : (
        <>
          {startIcon && <span className="mr-2">{startIcon}</span>}
          {children}
          {endIcon && <span className="ml-2">{endIcon}</span>}
        </>
      )}
    </button>
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }
