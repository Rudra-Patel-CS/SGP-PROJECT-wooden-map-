import * as React from "react";
import { cn } from "@/lib_supabase/utils";

/* ================= CARD ROOT ================= */

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        `
        bg-card text-card-foreground
        flex flex-col gap-6
        
        rounded-2xl
        border border-border/60
        
        shadow-[var(--shadow-soft)]
        transition-all duration-300
        
        hover:shadow-[var(--shadow-md)]
        hover:-translate-y-1
        `,
        className,
      )}
      {...props}
    />
  );
}

/* ================= HEADER ================= */

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        `
        grid auto-rows-min gap-2
        px-7 pt-7
        `,
        className,
      )}
      {...props}
    />
  );
}

/* ================= TITLE ================= */

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        `
        font-serif
        text-lg
        tracking-[0.01em]
        text-foreground
        `,
        className,
      )}
      {...props}
    />
  );
}

/* ================= DESCRIPTION ================= */

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        `
        text-muted-foreground
        text-sm
        leading-relaxed
        `,
        className,
      )}
      {...props}
    />
  );
}

/* ================= CONTENT ================= */

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-7", className)}
      {...props}
    />
  );
}

/* ================= FOOTER ================= */

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        `
        flex items-center
        px-7 pb-7
        `,
        className,
      )}
      {...props}
    />
  );
}

/* ================= ACTION ================= */

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("self-end", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
