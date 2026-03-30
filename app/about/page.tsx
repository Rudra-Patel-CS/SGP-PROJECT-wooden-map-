import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  TreePine,
  Heart,
  Users,
  Award,
  Leaf,
  Hammer,
  Globe,
  Sparkles,
  Eye,
  ShieldCheck,
  Palette,
  Truck,
  Lock,
  Package,
  MapPin,
} from "lucide-react";

/* ─────────── DATA ─────────── */
const values = [
  {
    icon: Hammer,
    title: "Craftsmanship First",
    description:
      "Every map is carefully designed to provide both aesthetic appeal and meaningful storytelling, using premium quality wooden materials.",
  },
  {
    icon: Palette,
    title: "Unique Designs",
    description:
      "Artistic and one-of-a-kind map designs that combine art, craftsmanship, and modern technology for every space.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Each piece carries the passion of our artisans who pour their hearts into creating something truly special for your home.",
  },
  {
    icon: Globe,
    title: "Global Vision",
    description:
      "We believe in connecting people through art, bringing the beauty of our world into homes across every continent.",
  },
];

const offerings = [
  { icon: Globe, label: "World Maps" },
  { icon: MapPin, label: "Country Maps" },
  { icon: TreePine, label: "State & District Maps" },
  { icon: Palette, label: "Customized Wooden Maps" },
  { icon: Package, label: "Decorative Wall Map Installations" },
];

const whyChooseUs = [
  { icon: Award, text: "Premium quality wooden materials" },
  { icon: Palette, text: "Unique and artistic map designs" },
  { icon: Eye, text: "Easy online browsing and purchasing" },
  { icon: Lock, text: "Secure authentication and payment system" },
  { icon: Package, text: "Efficient order and stock management" },
  { icon: Truck, text: "Reliable delivery and service" },
];

const craftingProcess = [
  {
    step: "01",
    title: "Design & Planning",
    description:
      "Our designers meticulously plan each layer, ensuring every continent, country, and city is perfectly proportioned.",
  },
  {
    step: "02",
    title: "Wood Selection",
    description:
      "We hand-select premium wood from sustainable sources, choosing pieces with the most beautiful natural grain.",
  },
  {
    step: "03",
    title: "Precision Cutting",
    description:
      "Using state-of-the-art laser cutting technology, we achieve incredibly precise borders and intricate details.",
  },
  {
    step: "04",
    title: "Hand Finishing",
    description:
      "Each piece is carefully sanded, stained, and finished by hand with natural oils that enhance the wood's natural beauty.",
  },
  {
    step: "05",
    title: "Quality Check",
    description:
      "Every map undergoes rigorous quality inspection before being carefully packaged for its journey to your home.",
  },
];

const stats = [
  { number: "10,000+", label: "Maps Delivered" },
  { number: "50+", label: "Countries Served" },
  { number: "100%", label: "Premium Wood" },
  { number: "5+", label: "Years of Craft" },
];

const companies = [
  { name: "Aryam Creation", description: "Creative design and production" },
  { name: "Woody Baba", description: "Premium wood craftsmanship" },
  { name: "Pop Up Puzzles", description: "Interactive wooden designs" },
];

/* ─────────── PAGE ─────────── */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* ═══ Hero Section ═══ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#2a1810]">
        {/* Decorative wooden‑grain SVG background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grain" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M0,20 Q50,30 100,18 Q150,6 200,22" stroke="#C4A77D" strokeWidth="0.8" fill="none" />
                <path d="M0,50 Q50,60 100,48 Q150,36 200,52" stroke="#C4A77D" strokeWidth="0.6" fill="none" />
                <path d="M0,80 Q50,90 100,78 Q150,66 200,82" stroke="#C4A77D" strokeWidth="0.7" fill="none" />
                <path d="M0,110 Q50,120 100,108 Q150,96 200,112" stroke="#C4A77D" strokeWidth="0.5" fill="none" />
                <path d="M0,140 Q50,150 100,138 Q150,126 200,142" stroke="#C4A77D" strokeWidth="0.6" fill="none" />
                <path d="M0,170 Q50,180 100,168 Q150,156 200,172" stroke="#C4A77D" strokeWidth="0.8" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grain)" />
          </svg>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1810]/40 via-transparent to-[#2a1810]/60" />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <p className="text-[#C4A77D] text-xs uppercase tracking-[0.35em] mb-6 font-semibold">
            Our Story
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-[#F5F0EB] leading-tight mb-6 text-balance">
            Where Passion Meets Craftsmanship
          </h1>
          <p className="text-[#F5F0EB]/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-pretty">
            Aryam Maps is dedicated to offering beautifully crafted wooden maps
            designed to enhance home and office décor — combining art, craftsmanship,
            and modern technology.
          </p>
        </div>
      </section>

      {/* ═══ Introduction ═══ */}
      <section id="story" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent text-sm uppercase tracking-[0.2em] mb-3 font-medium">
                Who We Are
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-6 text-balance">
                Crafting Wooden Maps That Tell Stories
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Aryam Maps is an online platform dedicated to offering beautifully
                  crafted wooden maps designed to enhance home and office décor. Our goal
                  is to combine art, craftsmanship, and modern technology to create unique
                  wall décor pieces that represent the beauty of geography and travel.
                </p>
                <p>
                  Each wooden map is carefully designed to provide both aesthetic appeal and
                  meaningful storytelling, allowing customers to celebrate places they love
                  and memories they cherish.
                </p>
                <p>
                  Founded by <strong className="text-foreground">Kishan Patel</strong> and{" "}
                  <strong className="text-foreground">Bhumin Patel</strong>, Aryam Maps
                  has grown from a creative passion project into a platform that delivers
                  premium wooden maps to art lovers and geography enthusiasts worldwide.
                </p>
              </div>
            </div>

            {/* Decorative wooden map illustration instead of a broken image */}
            <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-[#3a2218] to-[#5c3a1e] flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grain2" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                      <path d="M0,15 Q30,20 60,12 Q90,4 120,16" stroke="#C4A77D" strokeWidth="0.6" fill="none" />
                      <path d="M0,45 Q30,50 60,42 Q90,34 120,46" stroke="#C4A77D" strokeWidth="0.5" fill="none" />
                      <path d="M0,75 Q30,80 60,72 Q90,64 120,76" stroke="#C4A77D" strokeWidth="0.6" fill="none" />
                      <path d="M0,105 Q30,110 60,102 Q90,94 120,106" stroke="#C4A77D" strokeWidth="0.5" fill="none" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grain2)" />
                </svg>
              </div>
              {/* Stylised map icon */}
              <div className="relative z-10 text-center">
                <Globe className="w-24 h-24 text-[#C4A77D]/60 mx-auto mb-6" strokeWidth={1} />
                <p className="font-serif text-3xl text-[#C4A77D] tracking-wide">Aryam Maps</p>
                <p className="text-[#C4A77D]/60 text-sm tracking-[0.2em] uppercase mt-2">Est. by Kishan & Bhumin</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Mission ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm uppercase tracking-[0.2em] mb-3 font-medium">
              Our Mission
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-6 text-balance">
              Inspiring Through Craftsmanship
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed text-pretty">
              Our mission is to bring creativity and elegance into living spaces by providing
              high-quality wooden maps that inspire exploration and appreciation of the world.
              We aim to deliver products that are visually stunning, durable, and crafted with precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ What We Offer ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent text-sm uppercase tracking-[0.2em] mb-3 font-medium">
                Our Products
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-6 text-balance">
                What We Offer
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We provide a wide range of wooden map designs suited for modern interiors,
                creating a warm, artistic atmosphere in any space.
              </p>
              <div className="space-y-4">
                {offerings.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/60 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-br from-[#3a2218] to-[#5c3a1e] rounded-2xl p-8 md:p-10 shadow-2xl">
              <h3 className="font-serif text-2xl text-[#C4A77D] mb-8">Why Choose Us</h3>
              <div className="space-y-5">
                {whyChooseUs.map((item) => (
                  <div key={item.text} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#C4A77D]/15 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[#C4A77D]" />
                    </div>
                    <span className="text-[#F5F0EB]/90 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Crafting Process ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm uppercase tracking-[0.2em] mb-3 font-medium">
              The Journey
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-4 text-balance">
              From Raw Wood to Wall Art
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Every map goes through a meticulous 5-step process that combines traditional
              craftsmanship with modern precision.
            </p>
          </div>

          <div className="space-y-8">
            {craftingProcess.map((item, index) => (
              <div
                key={item.step}
                className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
              >
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="font-serif text-3xl text-accent font-medium">{item.step}</span>
                  </div>
                </div>
                <div className="w-full md:w-2/3 bg-card p-8 rounded-xl border border-border">
                  <h3 className="font-serif text-xl text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Stats ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#2a1810] text-[#F5F0EB]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-4xl md:text-5xl font-medium mb-2 text-[#C4A77D]">
                  {stat.number}
                </p>
                <p className="text-[#F5F0EB]/70 text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Our Vision ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#3a2218] to-[#5c3a1e] flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grain3" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                      <path d="M0,15 Q25,20 50,12 Q75,4 100,16" stroke="#C4A77D" strokeWidth="0.6" fill="none" />
                      <path d="M0,45 Q25,50 50,42 Q75,34 100,46" stroke="#C4A77D" strokeWidth="0.5" fill="none" />
                      <path d="M0,75 Q25,80 50,72 Q75,64 100,76" stroke="#C4A77D" strokeWidth="0.6" fill="none" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grain3)" />
                </svg>
              </div>
              <div className="relative z-10 text-center p-8">
                <Eye className="w-16 h-16 text-[#C4A77D]/50 mx-auto mb-4" strokeWidth={1} />
                <p className="font-serif text-2xl text-[#C4A77D]">Our Vision</p>
                <p className="text-[#C4A77D]/50 text-sm mt-2 max-w-xs mx-auto">
                  Leading the future of decorative wooden maps
                </p>
              </div>
            </div>

            <div>
              <p className="text-accent text-sm uppercase tracking-[0.2em] mb-3 font-medium">
                Looking Ahead
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-6 text-balance">
                Our Vision for the Future
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We envision becoming a leading platform for decorative wooden maps
                  by continuously improving our designs, technology, and customer
                  experience.
                </p>
                <p>
                  In the future, we aim to expand our offerings with customized
                  designs, global delivery, and innovative features powered by
                  modern technology.
                </p>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-accent" />
                  <span className="text-sm font-medium text-foreground">Quality Assured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-8 h-8 text-accent" />
                  <span className="text-sm font-medium text-foreground">Eco Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ The Founders & Companies ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-6 h-6 text-accent" />
            <p className="text-accent text-sm uppercase tracking-[0.2em] font-medium">
              Our Team
            </p>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-6 text-balance max-w-3xl mx-auto">
            Meet the Founders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
            Behind every map is a team of passionate craftspeople who believe in creating
            meaningful art that connects people to the places they love.
          </p>

          {/* Founders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
            {[
              { name: "Kishan Patel", role: "Co-Founder & CEO" },
              { name: "Bhumin Patel", role: "Co-Founder & Creative Director" },
            ].map((founder) => (
              <div key={founder.name} className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8b5a3c] to-[#C4A77D] flex items-center justify-center mx-auto mb-5">
                  <span className="font-serif text-2xl text-white font-medium">
                    {founder.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-foreground mb-1">{founder.name}</h3>
                <p className="text-muted-foreground text-sm">{founder.role}</p>
              </div>
            ))}
          </div>

          {/* Our Companies / Brands */}
          <div>
            <p className="text-accent text-sm uppercase tracking-[0.2em] mb-6 font-medium">
              Our Brands
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {companies.map((company) => (
                <div key={company.name} className="bg-card p-6 rounded-xl border border-border hover:border-accent/30 transition-colors duration-300">
                  <h4 className="font-serif text-lg text-foreground mb-1">{company.name}</h4>
                  <p className="text-muted-foreground text-xs">{company.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Customer Commitment ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-10 h-10 text-accent mx-auto mb-6" />
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-6 text-balance">
            Our Commitment to You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg text-pretty mb-8">
            At Aryam Maps, customer satisfaction is our top priority. We strive to
            provide high-quality products, secure transactions, and excellent support
            to ensure that every customer enjoys a memorable experience with our brand.
          </p>

          <div className="bg-secondary rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
            <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed mb-6 text-pretty italic">
              &ldquo;We don&apos;t just make maps. We create pieces of art that connect people to the
              places they love, the journeys they&apos;ve taken, and the dreams they&apos;re still
              chasing.&rdquo;
            </p>
            <p className="text-accent font-medium">Kishan Patel & Bhumin Patel</p>
            <p className="text-sm text-muted-foreground">Co-Founders, Aryam Maps</p>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-6 text-balance">
            Ready to Bring the World Into Your Home?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Explore our collection of handcrafted wooden maps or create your own custom piece
            that tells your unique story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link href="/shop">Shop Collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 bg-transparent">
              <Link href="/customize">Create Custom Map</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
