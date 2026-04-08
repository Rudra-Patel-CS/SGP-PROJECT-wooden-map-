"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSettings } from "@/components/settings-context";
import { Search, Package, Truck, Paintbrush, HelpCircle, Mail } from "lucide-react";

const faqCategories = [
  {
    id: "products",
    name: "Products & Materials",
    icon: Package,
    faqs: [
      {
        question: "What types of wood do you use for your maps?",
        answer:
          "We use a variety of premium, sustainably sourced woods including Baltic Birch, American Walnut, White Oak, and Maple. Each wood type offers unique grain patterns and colors, allowing you to choose the perfect match for your space. All our wood comes from FSC-certified forests.",
      },
      {
        question: "What sizes are available for your wooden maps?",
        answer:
          "Our wooden maps come in five standard sizes: Small (60x40cm), Medium (90x60cm), Large (120x80cm), Extra Large (150x100cm), and Giant (200x130cm). We also offer custom sizing for special projects. Please contact us for custom dimensions and pricing.",
      },
      {
        question: "Are the maps suitable for humid environments like bathrooms?",
        answer:
          "Our standard maps are treated with a protective finish that resists minor humidity, but they're best suited for indoor, climate-controlled environments. For bathrooms or high-humidity areas, we recommend our Humidity-Resistant collection, which features additional marine-grade sealant.",
      },
      {
        question: "What is the thickness of your wooden maps?",
        answer:
          "Our maps feature a layered 3D design with varying depths. The base layer is typically 6mm thick, with additional layers adding 3-6mm of depth each. The total depth ranges from 12mm to 25mm depending on the design complexity, creating a stunning dimensional effect.",
      },
      {
        question: "Can I customize the country labels and language?",
        answer:
          "Yes! We offer maps with labels in over 15 languages including English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Korean, Arabic, and more. You can also choose to have no labels for a minimalist look, or request custom labeling.",
      },
    ],
  },
  {
    id: "shipping",
    name: "Shipping & Delivery",
    icon: Truck,
    faqs: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping within the United States takes 5-7 business days. Express shipping (2-3 business days) is available for an additional fee. International shipping typically takes 10-15 business days depending on the destination. Custom orders require an additional 5-7 days for production.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to over 50 countries worldwide. International shipping rates are calculated at checkout based on your location and the size of your order. Please note that customs duties and taxes may apply and are the responsibility of the recipient.",
      },
      {
        question: "How are the maps packaged for shipping?",
        answer:
          "Each map is carefully wrapped in acid-free tissue paper, cushioned with custom foam inserts, and placed in a double-walled corrugated box. For larger maps, we use wooden crates to ensure maximum protection. We take every precaution to ensure your map arrives in perfect condition.",
      },
      {
        question: "What if my map arrives damaged?",
        answer:
          "In the rare event that your map arrives damaged, please contact us within 48 hours with photos of the damage. We'll arrange a free replacement or full refund. Our maps are insured during shipping, so you're fully protected.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Absolutely! Once your order ships, you'll receive an email with a tracking number and link. You can track your package's journey from our workshop to your door. For custom orders, we'll also send progress updates during production.",
      },
    ],
  },
  {
    id: "customization",
    name: "Customization Options",
    icon: Paintbrush,
    faqs: [
      {
        question: "Can I request a map of a specific city or region?",
        answer:
          "Yes! Our custom map service allows you to request any city, region, or country in the world. Simply provide us with the location details, and our design team will create a unique map just for you. Custom city maps typically feature detailed street layouts and landmarks.",
      },
      {
        question: "How does LED backlighting work?",
        answer:
          "Our LED backlighting system consists of warm white LEDs that are carefully integrated behind the map layers. The lights are powered by a low-voltage adapter (included) and feature a dimmer switch. The LEDs create a beautiful ambient glow that highlights the map's dimensional features.",
      },
      {
        question: "Can I add personal markers or pins to my map?",
        answer:
          "Yes! We offer a pin marker accessory set that includes decorative wooden pins you can use to mark places you've visited, want to visit, or hold special meaning. For a more permanent option, we can engrave custom markers directly onto your map during production.",
      },
      {
        question: "Do you offer corporate or bulk customization?",
        answer:
          "We work with businesses, hotels, restaurants, and event planners to create custom maps with logos, branding, or specific design requirements. Volume discounts are available for orders of 5 or more maps. Contact our corporate team for a custom quote.",
      },
      {
        question: "Can I see a preview before my custom map is made?",
        answer:
          "For all custom orders, we provide a digital mockup for your approval before production begins. You'll be able to see the layout, colors, and any text or markers. We won't proceed until you're 100% satisfied with the design.",
      },
    ],
  },
  {
    id: "installation",
    name: "Installation & Care",
    icon: HelpCircle,
    faqs: [
      {
        question: "How do I install my wooden map?",
        answer:
          "Each map comes with a complete hanging kit including wall anchors, screws, and a level guide. For smaller maps (under 90cm), standard picture hooks work well. Larger maps use a French cleat system for secure, level mounting. Detailed instructions and video tutorials are included with every order.",
      },
      {
        question: "How much does a wooden map weigh?",
        answer:
          "Weight varies by size: Small maps weigh approximately 2-3kg, Medium 4-5kg, Large 7-9kg, Extra Large 12-15kg, and Giant maps 18-22kg. Weight also depends on the wood type chosen. Please ensure your wall can support the weight using appropriate anchors.",
      },
      {
        question: "How do I clean and maintain my wooden map?",
        answer:
          "Dust your map regularly with a soft, dry microfiber cloth. Avoid using water or cleaning chemicals directly on the wood. For deeper cleaning, lightly dampen the cloth and immediately dry the surface. We recommend applying wood conditioner once a year to maintain the finish's luster.",
      },
      {
        question: "Will the wood color change over time?",
        answer:
          "Like all natural wood products, your map may develop a beautiful patina over time. Direct sunlight can cause some fading, so we recommend hanging your map away from direct UV exposure. This natural aging process adds character and is part of wood's authentic beauty.",
      },
      {
        question: "Can the map be mounted outdoors?",
        answer:
          "Our standard maps are designed for indoor use only. Outdoor exposure to weather, UV, and humidity would damage the wood and finish. For covered outdoor spaces (like screened porches), contact us about our weather-resistant options, though indoor display is always recommended.",
      },
    ],
  },
];

export default function FAQPage() {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  const displayCategories = selectedCategory
    ? filteredCategories.filter((cat) => cat.id === selectedCategory)
    : filteredCategories;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-secondary/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
                Frequently Asked Questions
              </h1>
              <p className="mt-6 text-lg text-muted-foreground text-pretty">
                Find answers to common questions about our handcrafted wooden
                maps, shipping, customization, and more.
              </p>

              {/* Search */}
              <div className="relative mx-auto mt-10 max-w-xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-4 text-lg rounded-full border-2 border-border focus:border-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="border-b border-border bg-card py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="rounded-full"
              >
                All Topics
              </Button>
              {faqCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="rounded-full"
                >
                  <category.icon className="mr-2 h-4 w-4" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              {displayCategories.length > 0 ? (
                displayCategories.map((category) => (
                  <div key={category.id} className="mb-12 last:mb-0">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-foreground">
                        {category.name}
                      </h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {category.faqs.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`${category.id}-${index}`}
                          className="border-b border-border"
                        >
                          <AccordionTrigger className="py-5 text-left font-medium text-foreground hover:text-primary hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center">
                  <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">
                    No results found
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    We couldn&apos;t find any FAQs matching your search. Try a
                    different term or browse all categories.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 bg-transparent"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Still Have Questions CTA */}
        <section className="border-t border-border bg-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                Still Have Questions?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Can&apos;t find what you&apos;re looking for? Our customer
                support team is here to help. We typically respond within 24
                hours.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={`mailto:${settings.support_email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    {settings.support_email}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-card py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-center text-2xl font-bold text-foreground md:text-3xl">
              Helpful Resources
            </h2>
            <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/shop"
                className="group rounded-lg border border-border bg-background p-6 text-center transition-shadow hover:shadow-md"
              >
                <Package className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-4 font-medium text-foreground group-hover:text-primary">
                  Browse Products
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Explore our collection
                </p>
              </Link>
              <Link
                href="/about"
                className="group rounded-lg border border-border bg-background p-6 text-center transition-shadow hover:shadow-md"
              >
                <HelpCircle className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-4 font-medium text-foreground group-hover:text-primary">
                  About Us
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our story & mission
                </p>
              </Link>
              <Link
                href="/blog"
                className="group rounded-lg border border-border bg-background p-6 text-center transition-shadow hover:shadow-md"
              >
                <Mail className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-4 font-medium text-foreground group-hover:text-primary">
                  Read Our Blog
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tips & inspiration
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
