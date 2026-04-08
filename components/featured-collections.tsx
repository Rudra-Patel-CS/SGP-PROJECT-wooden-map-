"use client";

import Link from "next/link";
import { Globe2, MapPin, LayoutGrid, ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animate";

const categories = [
  {
    name: "World Maps",
    description: "Explore our handcrafted world maps — precision-cut layers that bring every continent to life on your wall.",
    icon: Globe2,
    href: "/shop?category=world",
    accent: "#8b5a3c",
    bg: "linear-gradient(135deg, #f5ebe0 0%, #e8d5c4 100%)",
    count: "Premium Collection",
  },
  {
    name: "Country Maps",
    description: "Celebrate your homeland with detailed country maps carved from sustainably sourced birch plywood.",
    icon: MapPin,
    href: "/shop?category=country",
    accent: "#6b4f3a",
    bg: "linear-gradient(135deg, #e8d5c4 0%, #d4bfa8 100%)",
    count: "Regional Designs",
  },
  {
    name: "All Products",
    description: "Browse our entire catalog of handcrafted wooden maps — world, country, and custom pieces all in one place.",
    icon: LayoutGrid,
    href: "/shop",
    accent: "#4b372a",
    bg: "linear-gradient(135deg, #d4bfa8 0%, #c4a882 100%)",
    count: "Full Catalog",
  },
];

export function FeaturedCollections() {
  return (
    <section className="py-28 px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal variant="fadeUp">
          <div className="text-center mb-20">
            <p className="text-accent text-xs uppercase tracking-[0.35em] mb-4 font-semibold">
              Collections
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From world maps to detailed country pieces, discover wooden art
              designed to transform your space.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Category Cards */}
        <StaggerContainer className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto" staggerDelay={0.15}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <StaggerItem key={cat.name}>
                <Link
                  href={cat.href}
                  className="group relative block rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{ background: cat.bg }}
                >
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '20px 20px' }} />

                  {/* Content */}
                  <div className="relative p-8 md:p-10 min-h-[320px] flex flex-col justify-between">
                    {/* Top: Icon + Badge */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                          style={{ background: `${cat.accent}15`, border: `1.5px solid ${cat.accent}25` }}
                        >
                          <Icon className="w-7 h-7" style={{ color: cat.accent }} />
                        </div>
                        <span
                          className="text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
                          style={{ color: cat.accent, background: `${cat.accent}12`, border: `1px solid ${cat.accent}20` }}
                        >
                          {cat.count}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-2xl md:text-3xl mb-3" style={{ color: cat.accent }}>
                        {cat.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm leading-relaxed opacity-75" style={{ color: cat.accent }}>
                        {cat.description}
                      </p>
                    </div>

                    {/* Bottom: CTA */}
                    <div className="flex items-center gap-2 mt-8 font-medium text-sm" style={{ color: cat.accent }}>
                      <span className="group-hover:tracking-wider transition-all duration-300">
                        Explore Collection
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                    </div>

                    {/* Decorative corner element */}
                    <div
                      className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full opacity-[0.06] transition-transform duration-700 group-hover:scale-125"
                      style={{ background: cat.accent }}
                    />
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
