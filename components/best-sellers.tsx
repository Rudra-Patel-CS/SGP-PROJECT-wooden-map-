
import Link from "next/link";
import { Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Rustic Wood World Map",
    price: 2000,
    rating: 5,
    reviews: 100,
    image: "/world-map-1.jpeg",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Light Oak World Map",
    price: 2000,
    rating: 5,
    reviews: 100,
    image: "/world-map-2.jpeg",
    badge: null,
  },
  {
    id: 3,
    name: "Multi-Tone India Map",
    price: 2000,
    rating: 5,
    reviews: 100,
    image: "/country-map-1.jpeg",
    badge: "Popular",
  },
  {
    id: 4,
    name: "LED Europe Map",
    price: 2000,
    rating: 5,
    reviews: 100,
    image: "/world-map-detail.jpeg",
    badge: "Latest",
  },
];

export function BestSellers() {
  return (
    <section className="py-28 px-6 lg:px-8 bg-[#f5f3ef]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm tracking-[0.35em] uppercase text-[#7a5c43] mb-3">
            Shop
          </p>

          <div className="flex items-end justify-between">
            <h2 className="font-serif text-4xl md:text-5xl text-[#3e2d21]">
              Best Seller
            </h2>

            <Link
              href="/shop"
              className="text-[#7a5c43] font-medium hover:opacity-70 transition"
            >
              View All →
            </Link>
          </div>
        </div>

        {/* Products */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group block"
            >
              {/* Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#ebe7e1]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badge */}
                {product.badge && (
                  <span
                    className="
                    absolute top-3 left-3
                    text-xs
                    bg-[#6b4f3a]
                    text-white
                    px-3 py-1
                    rounded-full
                    shadow-sm
                  "
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="mt-4">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#f4b740] text-[#f4b740]"
                    />
                  ))}

                  <span className="text-sm text-[#6b5a4d] ml-1">
                    ({product.reviews})
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-[#3e2d21] font-medium group-hover:opacity-70 transition">
                  {product.name}
                </h3>

                {/* Price */}
                <p className="mt-1 font-semibold text-[#3e2d21]">
                  ₹ {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
