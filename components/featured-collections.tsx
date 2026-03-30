
import Link from "next/link";

const collections = [
  {
    name: "World Maps",
    description: "Explore our collection of handcrafted world maps",
    image: "/world-map-1.jpeg",
    href: "/shop?category=world",
    count: "Premium Designs",
  },
  {
    name: "Country Maps",
    description: "Celebrate your homeland with detailed country maps",
    image: "/country-map-1.jpeg",
    href: "/shop?category=country",
    count: "Regional Designs",
  },
];

export function FeaturedCollections() {
  return (
    <section className="py-28 px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/*Section Header */}
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

        {/*Cards */}
        <div className="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
          {collections.map((collection) => (
            <Link
              key={collection.name}
              href={collection.href}
              className="
                group relative block
                aspect-[4/5]
                overflow-hidden
                rounded-2xl
                bg-muted
                shadow-sm
                hover:shadow-2xl
                transition-all duration-500
              "
            >
              {/* Image */}
              <img
                src={collection.image}
                alt={collection.name}
                className="
                  absolute inset-0 w-full h-full
                  object-cover
                  transition-transform duration-[1200ms]
                  group-hover:scale-110
                "
              />

              {/* Premium Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-90" />

              {/* Content */}
              <div className="absolute bottom-0 p-7">
                <p className="text-white/70 text-xs uppercase tracking-widest mb-2">
                  {collection.count}
                </p>

                <h3 className="font-serif text-2xl text-white mb-2">
                  {collection.name}
                </h3>

                <p className="text-white/80 text-sm mb-5 max-w-xs">
                  {collection.description}
                </p>

                {/* Animated CTA */}
                <div className="flex items-center gap-2 text-white font-medium">
                  Explore Collection
                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
