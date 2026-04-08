"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="/world-map-room.jpeg"
        alt="Handcrafted wooden world map in a beautiful living room"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/80 text-xs sm:text-sm uppercase tracking-[0.35em] mb-6 font-medium"
        >
          Aryam Maps · Crafting Since 2019
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.1] mb-6"
        >
          Handcrafted Wooden Maps
          <br />
          Built to Inspire
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/85 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Transform your space with premium wooden wall art. Sustainably
          sourced. Precision crafted. Designed to last generations.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-white/90 px-10 py-6 text-base font-semibold shadow-xl"
          >
            <Link href="/shop">Shop Maps</Link>
          </Button>
        </motion.div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[22px] h-[38px] rounded-full border border-white/40 flex justify-center p-1">
          <div className="w-[3px] h-[8px] bg-white/70 rounded-full animate-bounce mt-1" />
        </div>
      </motion.div>
    </section>
  );
}
