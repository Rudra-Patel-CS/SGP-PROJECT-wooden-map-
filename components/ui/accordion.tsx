"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib_supabase/utils";

/* ================= ROOT ================= */

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

/* ================= ITEM ================= */

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        `
        rounded-2xl
        border border-border
        
        bg-card
        shadow-[var(--shadow-soft)]
        
        transition-all duration-300
        
        data-[state=open]:shadow-[var(--shadow-md)]
        `,
        className,
      )}
      {...props}
    />
  );
}

/* ================= TRIGGER ================= */

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        className={cn(
          `
          flex w-full items-center justify-between
          
          px-6 py-5
          
          text-left
          font-serif text-lg
          
          hover:bg-secondary/40
          
          transition-all duration-250
          
          focus-visible:outline-none
          `,
          className,
        )}
        {...props}
      >
        {children}

        <ChevronDown
          className="
          size-5
          text-muted-foreground
          transition-transform duration-300
          data-[state=open]:rotate-180
          "
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/* ================= CONTENT ================= */

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="
      overflow-hidden
      text-muted-foreground
      
      data-[state=closed]:animate-accordion-up
      data-[state=open]:animate-accordion-down
      "
      {...props}
    >
      <div className={cn("px-6 pb-6 pt-0 leading-relaxed", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
