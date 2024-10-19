import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "../../lib/utils"

const SwitchRoot = React.forwardRef(({ className, size = "default", color = "primary", ...props }, ref) => {
  const sizeClasses = {
    small: "h-[20px] w-[36px]",
    default: "h-[24px] w-[44px]",
    large: "h-[28px] w-[52px]"
  }

  const colorClasses = {
    primary: "data-[state=checked]:bg-primary",
    secondary: "data-[state=checked]:bg-secondary",
    accent: "data-[state=checked]:bg-accent"
  }

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchThumb size={size} />
    </SwitchPrimitives.Root>
  )
})
SwitchRoot.displayName = SwitchPrimitives.Root.displayName

const SwitchThumb = React.forwardRef(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    small: "h-4 w-4 data-[state=checked]:translate-x-4",
    default: "h-5 w-5 data-[state=checked]:translate-x-5",
    large: "h-6 w-6 data-[state=checked]:translate-x-6"
  }

  return (
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
        sizeClasses[size],
        className
      )}
      {...props}
      ref={ref}
    />
  )
})
SwitchThumb.displayName = SwitchPrimitives.Thumb.displayName

const Switch = React.forwardRef((props, ref) => (
  <SwitchRoot {...props} ref={ref} />
))
Switch.displayName = "Switch"

export { Switch, SwitchRoot, SwitchThumb }
