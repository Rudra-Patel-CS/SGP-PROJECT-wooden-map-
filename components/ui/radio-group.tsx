"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib_supabase/utils";

/* ================= ROOT ================= */

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-4", className)}
      {...props}
    />
  );
}

/* ================= ITEM ================= */

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        `
        relative
        
        size-5
        shrink-0
        
        rounded-full
        border-2 border-border
        
        bg-card
        
        transition-all duration-200
        
        hover:border-primary
        
        focus-visible:outline-none
        focus-visible:ring-4
        focus-visible:ring-primary/20
        
        data-[state=checked]:border-primary
        
        disabled:opacity-50
        disabled:cursor-not-allowed
        `,
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className="
          flex items-center justify-center
        "
      >
        <Circle className="size-2.5 fill-primary text-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
