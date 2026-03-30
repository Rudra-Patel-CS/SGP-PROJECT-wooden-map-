import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib_supabase/utils";

const buttonVariants = cva(
  `
  inline-flex items-center justify-center gap-2
  whitespace-nowrap
  rounded-lg
  text-sm font-medium
  transition-all duration-300
  disabled:pointer-events-none disabled:opacity-50
  
  outline-none
  focus-visible:ring-2 focus-visible:ring-ring
  
  active:scale-[0.98]

  [&_svg]:pointer-events-none
  [&_svg]:size-4
  shrink-0
  `,
  {
    variants: {
      variant: {
        /* 🔥 PRIMARY CTA — PREMIUM */
        default: `
          bg-primary
          text-primary-foreground
          shadow-[var(--shadow-soft)]
          hover:shadow-[var(--shadow-md)]
          hover:-translate-y-[1px]
        `,

        destructive: `
          bg-destructive
          text-white
          hover:opacity-90
        `,

        /* ⭐ OUTLINE — Much More Elegant */
        outline: `
          border
          bg-background
          hover:bg-secondary
          hover:border-primary/30
        `,

        secondary: `
          bg-secondary
          text-secondary-foreground
          hover:bg-secondary/80
        `,

        /* ⭐ Ghost should feel invisible */
        ghost: `
          hover:bg-secondary
        `,

        link: `
          text-primary
          underline-offset-4
          hover:underline
        `,
      },

      size: {
        /* ⭐ Better vertical rhythm */
        default: "h-10 px-5",

        sm: "h-8 px-3 text-sm",

        lg: "h-12 px-8 text-base",

        icon: "size-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
