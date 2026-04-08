"use client";

import Link from "next/link";
import { Star, ArrowRight, Loader2 } from "lucide-react";
import { useSettings } from "@/components/settings-context";
import { formatPrice } from "@/lib_supabase/utils";
import { useEffect, useState } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animate";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews_count: number;
  image_url: string | null;
  images: string[];
  badge: string | null;
  category: string;
}

export function BestSellers() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/products?featured=true");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.slice(0, 8)); // Show max 8
        }
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  // Don't render the section at all if no featured products
  if (!loading && products.length === 0) return null;

  return (
    <section className="py-28 px-6 lg:px-8 bg-[#f5f3ef]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal variant="fadeUp">
          <div className="mb-16">
            <p className="text-sm tracking-[0.35em] uppercase text-[#7a5c43] mb-3">
              Featured
            </p>
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-4xl md:text-5xl text-[#3e2d21]">
                Featured Products
              </h2>
              <Link
                href="/shop"
                className="text-[#7a5c43] font-medium hover:opacity-70 transition flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#8b5a3c]">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading featured products...
          </div>
        ) : (
          <StaggerContainer
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            staggerDelay={0.1}
          >
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <Link
                  href={`/product/${product.id}`}
                  className="group block"
                >
                  {/* Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#ebe7e1]">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#8b5a3c]/40 font-serif text-lg">
                        No Image
                      </div>
                    )}

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 text-xs bg-[#6b4f3a] text-white px-3 py-1 rounded-full shadow-sm">
                        {product.badge}
                      </span>
                    )}

                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Info */}
                  <div className="mt-4">
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(product.rating || 0)
                              ? "fill-[#f4b740] text-[#f4b740]"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                      {product.reviews_count > 0 && (
                        <span className="text-sm text-[#6b5a4d] ml-1">
                          ({product.reviews_count})
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-[#3e2d21] font-medium group-hover:opacity-70 transition">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <p className="mt-1 font-semibold text-[#3e2d21]">
                      {formatPrice(product.price, settings.currency)}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
