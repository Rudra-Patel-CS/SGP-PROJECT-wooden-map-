import * as React from "react";
import { cn } from "@/lib_supabase/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `
        w-full min-w-0
        
        h-11
        px-4
        
        rounded-lg
        border border-border
        
        bg-secondary/40
        text-foreground
        
        placeholder:text-muted-foreground
        
        shadow-[inset_0_1px_2px_rgba(74,44,20,0.06)]
        
        outline-none
        transition-all duration-200
        
        focus:border-primary/40
        focus:bg-background
        focus:shadow-[0_0_0_3px_rgba(155,123,101,0.15)]
        
        disabled:opacity-50
        disabled:cursor-not-allowed
        `,
        className,
      )}
      {...props}
    />
  );
}

export { Input };
