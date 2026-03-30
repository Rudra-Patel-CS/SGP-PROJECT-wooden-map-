"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib_supabase/utils"

/* ================= ROOT ================= */

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

/* ================= LIST ================= */

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        `
        inline-flex items-center
        
        rounded-xl
        border border-border
        
        bg-secondary/60
        p-1
        
        shadow-[var(--shadow-soft)]
        `,
        className
      )}
      {...props}
    />
  )
}

/* ================= TRIGGER ================= */

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        `
        inline-flex items-center justify-center
        
        rounded-lg
        px-5
        h-10
        
        text-sm font-medium
        
        text-muted-foreground
        transition-all duration-250
        
        hover:text-foreground
        
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        
        disabled:pointer-events-none
        disabled:opacity-50
        
        /* ⭐ ACTIVE TAB */
        data-[state=active]:bg-background
        data-[state=active]:text-foreground
        data-[state=active]:shadow-[var(--shadow-soft)]
        `,
        className
      )}
      {...props}
    />
  )
}

/* ================= CONTENT ================= */

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        `
        outline-none
        `,
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
