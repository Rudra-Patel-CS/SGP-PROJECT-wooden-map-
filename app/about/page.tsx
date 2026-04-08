"use client";

import { useSettings } from "@/components/settings-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animate";
import { motion } from "framer-motion";
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
  MapPin,
  Compass,
  Scissors,
  Paintbrush,
  CheckCircle2,
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
];

const whyChooseUs = [
  { icon: Award, text: "Premium quality wooden materials" },
  { icon: Palette, text: "Unique and artistic map designs" },
  { icon: Eye, text: "Easy online browsing and purchasing" },
  { icon: ShieldCheck, text: "Secure authentication and payment system" },
];

const craftingProcess = [
  {
    step: "01",
    title: "Design & Planning",
    description:
      "Our designers meticulously plan each layer, ensuring every continent, country, and city is perfectly proportioned.",
    icon: Compass,
    gradient: "from-[#f5ebe0] to-[#e8d5c4]",
    accentColor: "#8b5a3c",
  },
  {
    step: "02",
    title: "Wood Selection",
    description:
      "We hand-select premium wood from sustainable sources, choosing pieces with the most beautiful natural grain.",
    icon: TreePine,
    gradient: "from-[#e8d5c4] to-[#d4bfa8]",
    accentColor: "#6b4f3a",
  },
  {
    step: "03",
    title: "Precision Cutting",
    description:
      "Using state-of-the-art laser cutting technology, we achieve incredibly precise borders and intricate details.",
    icon: Scissors,
    gradient: "from-[#d4bfa8] to-[#c4a882]",
    accentColor: "#5a3726",
  },
  {
    step: "04",
    title: "Hand Finishing",
    description:
      "Each piece is carefully sanded, stained, and finished by hand with natural oils that enhance the wood's natural beauty.",
    icon: Paintbrush,
    gradient: "from-[#e8d5c4] to-[#d4bfa8]",
    accentColor: "#7a5c43",
  },
  {
    step: "05",
    title: "Quality Check",
    description:
      "Every map undergoes rigorous quality inspection before being carefully packaged for its journey to your home.",
    icon: CheckCircle2,
    gradient: "from-[#f5ebe0] to-[#e8d5c4]",
    accentColor: "#4b372a",
  },
];

const stats = [
  { number: "200+", label: "Maps Delivered" },
  { number: "3+", label: "Countries Served" },
  { number: "100%", label: "Premium Wood" },
  { number: "6+", label: "Years of Craft" },
];

const companies = [
  { name: "Aryam Creation", description: "Creative design and production" },
  { name: "Woody Baba", description: "Premium wood craftsmanship" },
  { name: "Pop Up Puzzles", description: "Interactive wooden designs" },
];

// Showcase images from Aryam Creation product catalog
const showcaseImages = [
  { name: "3D Wooden World Map", url: "/world-map-1.jpeg" },
  { name: "Ayodhya Ram Mandir Model", url: "https://5.imimg.com/data5/SELLER/Default/2023/12/370548902/YW/SN/BW/62753935/ayodhya-ram-mandir-model-500x500.jpeg" },
  { name: "MDF Dry Fruit Box", url: "https://img2.exportersindia.com/product_images/bc-small/2022/2/9140895/mdf-dry-fruit-box-1644040645-6188290.jpeg" },
  { name: "Designer Wooden Clock", url: "https://5.imimg.com/data5/SELLER/Default/2021/1/BO/WW/IV/62753935/designer-wooden-wall-clock-500x500.jpg" },
  { name: "Detailed Country Map", url: "/country-map-1.jpeg" },
  { name: "Corporate Pen Stand", url: "https://5.imimg.com/data5/SELLER/Default/2021/1/EC/NQ/WF/62753935/corporate-pen-stand-500x500.jpg" },
  { name: "Wooden Diary", url: "https://img2.exportersindia.com/product_images/bc-small/2022/2/9140895/wooden-diary-1644041309-6188330.jpeg" },
  { name: "Dark Finish World Map", url: "/world-map-dark.jpeg" },
  { name: "Laser Cut Tea Coaster", url: "https://img2.exportersindia.com/product_images/bc-small/2022/2/9140895/laser-cut-tea-coaster-1644040814-6188295.jpeg" },
  { name: "Heart Shape Gift Box", url: "https://5.imimg.com/data5/SELLER/Default/2021/1/KR/EU/UV/62753935/heart-shape-box-500x500.JPG" },
  { name: "MDF Multilayer Wall Art", url: "/world-map-3.jpeg" },
  { name: "Corporate Gift Box", url: "https://5.imimg.com/data5/GLADMIN/Default/2023/4/303245147/AE/AI/TT/62753935/corporate-gift-box-500x500.png" },
  { name: "Room Display Map", url: "/world-map-room.jpeg" },
  { name: "Wooden Spice Box", url: "https://img2.exportersindia.com/product_images/bc-small/2022/2/9140895/wooden-spice-box-1644041206-6188324.jpeg" },
];

/* ─────────── PAGE ─────────── */
export default function AboutPage() {
  const { settings } = useSettings();
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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[#C4A77D] text-xs uppercase tracking-[0.35em] mb-6 font-semibold"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-[#F5F0EB] leading-tight mb-6 text-balance"
          >
            The Art of Turning Wood<br />Into Wanderlust
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#F5F0EB]/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            {settings.store_name} is dedicated to offering beautifully crafted wooden maps
            designed to enhance home and office décor — combining art, craftsmanship,
            and modern technology.
          </motion.p>
        </div>
      </section>

      {/* ═══ Introduction ═══ */}
      <section id="story" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal variant="fadeLeft">
              <div>
                <p className="text-accent text-sm uppercase tracking-[0.2em] mb-3 font-medium">
                  Who We Are
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-6 text-balance">
                  Crafting Wooden Maps That Tell Stories
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {settings.store_name} is an online platform dedicated to offering beautifully
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
                    <strong className="text-foreground">Bhumin Patel</strong>, {settings.store_name}
                    has grown from a creative passion project into a platform that delivers
                    premium wooden maps to art lovers and geography enthusiasts worldwide.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Decorative branded glass card */}
            <ScrollReveal variant="fadeRight">
              <div className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[#3a2218] to-[#5c3a1e] flex items-center justify-center shadow-2xl">
                {/* Animated decorative rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 rounded-full border border-[#C4A77D]/10 absolute animate-pulse" />
                  <div className="w-56 h-56 rounded-full border border-[#C4A77D]/15 absolute" style={{ animationDelay: '0.5s' }} />
                  <div className="w-40 h-40 rounded-full border border-[#C4A77D]/20 absolute" />
                </div>
                {/* Wood grain pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grainIntro" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                        <path d="M0,15 Q30,20 60,12 Q90,4 120,16" stroke="#C4A77D" strokeWidth="0.6" fill="none" />
                        <path d="M0,45 Q30,50 60,42 Q90,34 120,46" stroke="#C4A77D" strokeWidth="0.5" fill="none" />
                        <path d="M0,75 Q30,80 60,72 Q90,64 120,76" stroke="#C4A77D" strokeWidth="0.6" fill="none" />
                        <path d="M0,105 Q30,110 60,102 Q90,94 120,106" stroke="#C4A77D" strokeWidth="0.5" fill="none" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grainIntro)" />
                  </svg>
                </div>
                {/* Central branding */}
                <div className="relative z-10 text-center px-8">
                  <Globe className="w-20 h-20 text-[#C4A77D]/50 mx-auto mb-6" strokeWidth={1} />
                  <p className="font-serif text-3xl text-[#C4A77D] tracking-wide mb-2">{settings.store_name}</p>
                  <div className="w-16 h-0.5 bg-[#C4A77D]/30 mx-auto my-4" />
                  <p className="text-[#C4A77D]/60 text-sm tracking-[0.2em] uppercase">Est. by Kishan & Bhumin</p>
                  <p className="text-[#C4A77D]/40 text-xs tracking-[0.15em] mt-2">Since 2019 · Ahmedabad, India</p>
                </div>
                {/* Corner accent */}
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#C4A77D]/20 rounded-tr-lg" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#C4A77D]/20 rounded-bl-lg" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ Mission & Values ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal variant="fadeUp">
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
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.12}>
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="bg-card p-8 rounded-xl border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                    <value.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ What We Offer + Why Choose Us ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal variant="fadeLeft">
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
                    <div key={item.label} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/60 border border-border/50 hover:bg-secondary transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeRight">
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ Crafting Process ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal variant="fadeUp">
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
          </ScrollReveal>

          <StaggerContainer className="space-y-8" staggerDelay={0.15}>
            {craftingProcess.map((item, index) => (
              <StaggerItem key={item.step} variant={index % 2 === 0 ? "fadeLeft" : "fadeRight"}>
                <div className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div className="w-full md:w-2/5">
                    <div className={`aspect-video rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center relative group/card`}>
                      {/* Decorative pattern */}
                      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                      {/* Animated icon */}
                      <div className="relative z-10 text-center">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-3" style={{ background: `${item.accentColor}15`, border: `1.5px solid ${item.accentColor}25` }}>
                          <item.icon className="w-10 h-10" style={{ color: item.accentColor }} />
                        </div>
                        <p className="font-serif text-lg font-medium" style={{ color: item.accentColor }}>{item.title}</p>
                      </div>
                      {/* Corner accents */}
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: `${item.accentColor}20` }} />
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: `${item.accentColor}20` }} />
                    </div>
                  </div>
                  <div className="w-full md:w-3/5 bg-card p-8 rounded-xl border border-border">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <span className="font-serif text-2xl text-accent font-medium">{item.step}</span>
                      </div>
                      <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ Our Vision ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal variant="fadeLeft">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#3a2218] to-[#5c3a1e] flex items-center justify-center">
                {/* Layered decorative elements */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grainVision" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M0,15 Q25,20 50,12 Q75,4 100,16" stroke="#C4A77D" strokeWidth="0.6" fill="none" />
                        <path d="M0,45 Q25,50 50,42 Q75,34 100,46" stroke="#C4A77D" strokeWidth="0.5" fill="none" />
                        <path d="M0,75 Q25,80 50,72 Q75,64 100,76" stroke="#C4A77D" strokeWidth="0.6" fill="none" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grainVision)" />
                  </svg>
                </div>
                {/* Concentric circles decoration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-[#C4A77D]/10 absolute" />
                  <div className="w-32 h-32 rounded-full border border-[#C4A77D]/15 absolute" />
                  <div className="w-16 h-16 rounded-full bg-[#C4A77D]/10 absolute" />
                </div>
                <div className="relative z-10 text-center p-8">
                  <Eye className="w-16 h-16 text-[#C4A77D]/50 mx-auto mb-4" strokeWidth={1} />
                  <p className="font-serif text-2xl text-[#C4A77D]">Our Vision</p>
                  <p className="text-[#C4A77D]/50 text-sm mt-2 max-w-xs mx-auto">
                    Leading the future of decorative wooden maps
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeRight">
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ The Founders & Companies ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal variant="fadeUp">
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
          </ScrollReveal>

          {/* Founders */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16" staggerDelay={0.15}>
            {[
              { name: "Kishan Patel", role: "Co-Founder & CEO" },
              { name: "Bhumin Patel", role: "Co-Founder & Creative Director" },
            ].map((founder) => (
              <StaggerItem key={founder.name} variant="scaleUp">
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8b5a3c] to-[#C4A77D] flex items-center justify-center mx-auto mb-5">
                    <span className="font-serif text-2xl text-white font-medium">
                      {founder.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-1">{founder.name}</h3>
                  <p className="text-muted-foreground text-sm">{founder.role}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Our Companies / Brands */}
          <ScrollReveal variant="fadeUp">
            <p className="text-accent text-sm uppercase tracking-[0.2em] mb-6 font-medium">
              Our Brands
            </p>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto" staggerDelay={0.1}>
            {companies.map((company) => (
              <StaggerItem key={company.name} variant="scaleUp">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300">
                  <h4 className="font-serif text-lg text-foreground mb-1">{company.name}</h4>
                  <p className="text-muted-foreground text-xs">{company.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ Customer Commitment ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal variant="scaleUp">
            <Sparkles className="w-10 h-10 text-accent mx-auto mb-6" />
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-6 text-balance">
              Our Commitment to You
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg text-pretty mb-8">
              At {settings.store_name}, customer satisfaction is our top priority. We strive to
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
              <p className="text-sm text-muted-foreground">Co-Founders, {settings.store_name}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ Stats ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#2a1810] text-[#F5F0EB]">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" staggerDelay={0.12}>
            {stats.map((stat) => (
              <StaggerItem key={stat.label} variant="scaleUp">
                <div>
                  <p className="font-serif text-4xl md:text-5xl font-medium mb-2 text-[#C4A77D]">
                    {stat.number}
                  </p>
                  <p className="text-[#F5F0EB]/70 text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ Auto-Running Showcase ═══ */}
      <section className="bg-secondary py-16 border-t border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Our Creations</h2>
            <p className="text-accent font-medium italic">Discover the full range of Aryam craftsmanship</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Auto-Running Showcase</p>
          </div>
        </div>

        <div className="relative">
          {/* Left/Right Gradients for smooth fade */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-secondary to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-secondary to-transparent z-20 pointer-events-none" />

          <motion.div
            className="flex gap-8 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 45, ease: "linear", repeat: Infinity }}
            style={{ width: "fit-content" }}
          >
            {[...showcaseImages, ...showcaseImages].map((p, i) => (
              <div key={i} className="flex-shrink-0 group">
                <div className="w-64 h-64 rounded-3xl overflow-hidden border border-border bg-background transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 relative">
                  <img
                    src={p.url}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-bold text-sm leading-tight">{p.name}</p>
                  </div>
                </div>
                <p className="mt-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                  {p.name}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
