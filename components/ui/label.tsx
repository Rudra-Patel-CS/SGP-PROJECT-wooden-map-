"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib_supabase/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        `
        text-sm
        font-medium
        
        text-foreground
        
        leading-none
        
        cursor-pointer
        
        peer-disabled:cursor-not-allowed
        peer-disabled:opacity-50
        
        select-none
        `,
        className
      )}
      {...props}
    />
  )
}

export { Label }
