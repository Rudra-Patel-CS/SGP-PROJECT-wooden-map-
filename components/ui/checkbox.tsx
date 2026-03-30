"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib_supabase/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `
        peer
        
        size-5
        shrink-0
        
        rounded-[5px]
        border-2 border-[#b8a08a]
        shadow-sm
        
        bg-transparent
        
        transition-all duration-250 ease-in-out
        
        hover:border-[#5a3726]
        hover:shadow-md
        
        data-[state=checked]:border-[#5a3726]
        data-[state=checked]:bg-transparent
        data-[state=checked]:shadow-md
        
        focus-visible:outline-none
        focus-visible:ring-4
        focus-visible:ring-[#5a3726]/20
        
        disabled:opacity-50
        disabled:cursor-not-allowed
        `,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="
          flex items-center justify-center
          animate-in zoom-in-75 fade-in duration-200
        "
      >
        <Check className="size-4 stroke-[3] text-[#5a3726]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
