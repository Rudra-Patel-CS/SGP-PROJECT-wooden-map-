import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib_supabase/utils";

const badgeVariants = cva(
  `
  inline-flex items-center justify-center
  rounded-full
  
  px-3 py-1
  
  text-xs font-semibold
  tracking-wide
  
  whitespace-nowrap
  
  border
  
  transition-all duration-200
  `,
  {
    variants: {
      variant: {
        /* 🔥 BEST SELLER / PRIMARY */
        default: `
          bg-primary/95
          text-primary-foreground
          border-primary/20
          shadow-[0_4px_12px_rgba(74,44,20,0.15)]
        `,

        /* ⭐ Soft Cream Badge */
        secondary: `
          bg-secondary
          text-foreground
          border-border
        `,

        /* ⭐ SALE / ALERT */
        destructive: `
          bg-destructive
          text-white
          border-transparent
        `,

        /* ⭐ Elegant Outline */
        outline: `
          bg-background
          text-foreground
          border-border
        `,

        /* ⭐ Minimal Tag */
        ghost: `
          bg-transparent
          text-muted-foreground
          border-transparent
        `,

        link: `
          text-primary
          underline-offset-4
          hover:underline
          border-transparent
        `,
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
