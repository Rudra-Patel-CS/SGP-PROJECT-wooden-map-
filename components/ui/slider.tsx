"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib_supabase/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {

  const values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min],
    [value, defaultValue, min]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none select-none items-center py-4",
        className
      )}
      {...props}
    >
      {/* TRACK */}
      <SliderPrimitive.Track
        className="
          relative h-[10px] w-full grow
          overflow-hidden
          rounded-full
          bg-[#e6dcd0]
          cursor-pointer
        "
      >
        {/* RANGE */}
        <SliderPrimitive.Range
          className="
            absolute h-full
            bg-gradient-to-r from-[#8b5a3c] to-[#9b7b65]
          "
        />
      </SliderPrimitive.Track>

      {/* THUMBS */}
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="
            block size-7
            rounded-full
            
            border-[3px] border-[#8b5a3c]
            bg-[#fffaf3]
            
            shadow-lg
            
            hover:shadow-2xl
            hover:border-[#6d4830]
            hover:bg-white
            
            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-[#8b5a3c]/40
            
            active:shadow-2xl
            active:border-[#6d4830]
            active:bg-white
            
            disabled:pointer-events-none
            disabled:opacity-50
            
            cursor-grab
            active:cursor-grabbing
            
            will-change-transform
          "
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
