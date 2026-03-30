"use client";

import Image from "next/image";
import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Art of Wooden Map Making",
    excerpt:
      "Discover the intricate process behind creating our handcrafted wooden maps.",
    image: "/Home.jpeg",
    category: "Craftsmanship",
    date: "February 15, 2024",
    readTime: "5 min read",
    author: "Admin",
  },
  {
    id: 2,
    title: "Choosing the Perfect Wood for Your Map",
    excerpt:
      "Learn about different wood types and how they affect the final product.",
    image: "/Custom.jpeg",
    category: "Materials",
    date: "February 10, 2024",
    readTime: "7 min read",
    author: "Admin",
  },
  {
    id: 3,
    title: "How to Choose the Perfect Wooden Map for Your Space",
    excerpt:
      "Discover the key factors to consider when selecting a wooden map that complements your interior design and personal style.",
    image: "/World.jpeg",
    category: "Interior Design",
    date: "January 15, 2024",
    readTime: "5 min read",
    author: "Admin",
  },
  {
    id: 4,
    title: "The Art of Wood Finishing: Behind Our Craftsmanship",
    excerpt:
      "Take a peek behind the scenes at our workshop and learn about the traditional techniques we use to create lasting beauty.",
    image: "/Country.jpeg",
    category: "Craftsmanship",
    date: "January 10, 2024",
    readTime: "7 min read",
    author: "Admin",
  },
  {
    id: 5,
    title: "Sustainable Wood Sourcing: Our Commitment to the Planet",
    excerpt:
      "Learn about our partnerships with certified sustainable forests and our zero-waste manufacturing process.",
    image: "/BS1.jpeg",
    category: "Sustainability",
    date: "January 5, 2024",
    readTime: "4 min read",
    author: "Admin",
  },
  {
    id: 6,
    title: "5 Creative Ways to Display Your Wooden Map",
    excerpt:
      "From accent lighting to gallery walls, explore innovative ideas to showcase your wooden map as a stunning centerpiece.",
    image: "/BS2.jpeg",
    category: "Interior Design",
    date: "December 28, 2023",
    readTime: "6 min read",
    author: "Admin",
  },
  {
    id: 7,
    title: "The History of Cartography in Wood Art",
    excerpt:
      "Journey through centuries of map-making and discover how wooden maps became a cherished form of wall art.",
    image: "/BS3.jpeg",
    category: "History",
    date: "December 20, 2023",
    readTime: "8 min read",
    author: "Admin",
  },
  {
    id: 8,
    title: "Gift Guide: Wooden Maps for Every Occasion",
    excerpt:
      "Whether it's a wedding, housewarming, or anniversary, find the perfect wooden map gift for your loved ones.",
    image: "/BS4.jpeg",
    category: "Gift Ideas",
    date: "December 15, 2023",
    readTime: "5 min read",
    author: "Admin",
  },
];

const categories = [
  "All",
  "Interior Design",
  "Craftsmanship",
  "Sustainability",
  "History",
  "Gift Ideas",
  "Materials",
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Show only 5 most recent posts unless "View More" is clicked
  const displayedPosts = showAll ? filteredPosts : filteredPosts.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#fffaf3]">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#f7f1e8] to-[#efe6d8] py-16 md:py-24 border-b border-[#e6dcd0]">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-[#2b1a12] md:text-5xl lg:text-6xl">
                Stories & Inspiration
              </h1>
              <p className="mt-6 text-lg text-[#5a3726]">
                Discover the artistry behind our wooden maps, interior design
                tips, and stories of craftsmanship that inspire.
              </p>
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#2b1a12] md:text-3xl">
                Recent Articles
              </h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b7b65]" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-[#d4b896] focus:border-[#8b5a3c]"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full ${
                    selectedCategory === category
                      ? "bg-[#8b5a3c] hover:bg-[#6d4830] text-white"
                      : "border-[#d4b896] text-[#5a3726] hover:bg-[#f7f1e8]"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayedPosts.map((post) => (
                <div
                  key={post.id}
                  className="group overflow-hidden rounded-lg border border-[#e6dcd0] bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#efe6d8]">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <Badge className="text-xs bg-[#9b7b65] text-white hover:bg-[#8b5a3c]">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-[#9b7b65]">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="mt-3 font-serif text-lg font-semibold text-[#2b1a12] group-hover:text-[#8b5a3c] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#5a3726] line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-[#9b7b65]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.author}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="mt-10 text-center">
                <p className="text-[#5a3726]">
                  No articles found matching your criteria.
                </p>
              </div>
            )}

            {/* View More / Show Less Button */}
            {filteredPosts.length > 5 && (
              <div className="mt-10 text-center">
                <Button
                  onClick={() => setShowAll(!showAll)}
                  className="bg-[#8b5a3c] hover:bg-[#6d4830] text-white px-8"
                >
                  {showAll ? "Show Less" : "View More"}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-gradient-to-br from-[#8b5a3c] to-[#6d4830] py-16 border-t border-[#d4b896]">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">
                Stay Inspired
              </h2>
              <p className="mt-4 text-white/90">
                Subscribe to our newsletter for the latest articles, design
                tips, and exclusive offers.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 sm:w-80"
                />
                <Button
                  className="bg-white text-[#8b5a3c] hover:bg-[#f7f1e8]"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
