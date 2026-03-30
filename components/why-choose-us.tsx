import { Hammer, Leaf, Palette, Truck } from "lucide-react";

const features = [
  {
    icon: Hammer,
    title: "Handcrafted Quality",
    description:
      "Each map is meticulously crafted by skilled artisans using traditional woodworking techniques combined with modern precision.",
  },
  {
    icon: Leaf,
    title: "Sustainable Wood",
    description:
      "We source our wood from certified sustainable forests, ensuring every purchase supports responsible forestry practices.",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description:
      "Choose your size, wood type, finish, and even add personalized engravings to create a truly unique piece.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Secure packaging and express shipping options ensure your map arrives safely and on time.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-28 px-6 lg:px-8 bg-[#e9e2d9]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-[#7a5c43] text-xs uppercase tracking-[0.35em] mb-4 font-semibold">
            Why Choose Us
          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-[#4b372a] mb-6">
            Crafted with Purpose
          </h2>

          <p className="text-[#6b5a4d] max-w-2xl mx-auto text-lg leading-relaxed">
            We believe in creating pieces that last generations, made with care
            for both craftsmanship and our planet.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="
                bg-[#f4efe9]
                p-8
                rounded-2xl
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              {/* Icon */}
              <div
                className="
                w-12 h-12
                rounded-lg
                bg-[#e3dace]
                flex items-center justify-center
                mb-6
              "
              >
                <feature.icon className="w-5 h-5 text-[#6b5a4d]" />
              </div>

              {/* Title */}
              <h3 className="font-serif text-lg text-[#4b372a] mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[#6b5a4d] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
