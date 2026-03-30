"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "John Doe",
    location: "Gujarat, India",
    rating: 5,
    text: "As an interior designer, I've recommended Aryam Maps to countless clients. The quality is consistent, the designs are elegant, and the sustainable sourcing aligns with my values.",
    product: "Multi-Tone India Map",
    avatar: "JD",
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    location: "New York, USA",
    rating: 5,
    text: "The craftsmanship is stunning. Our world map became the centerpiece of our living room.",
    product: "Classic World Map",
    avatar: "SM",
  },
  {
    id: 3,
    name: "James Thornton",
    location: "London, UK",
    rating: 5,
    text: "The final product exceeded expectations — truly a piece of art.",
    product: "Custom UK Map",
    avatar: "JT",
  },
];

export function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () =>
    setCurrentIndex((prev) => (prev + 1) % reviews.length);

  const prevReview = () =>
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const review = reviews[currentIndex] ?? reviews[0];

  return (
    <section className="py-32 px-6 lg:px-8 bg-[#e9e2d9]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.35em] text-xs text-[#7a5c43] mb-4">
            Reviews
          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-[#4b372a]">
            What Our Customers Say
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-[#f4efe9] rounded-3xl p-10 md:p-14">
          {/* Big Quote */}
          <Quote className="w-14 h-14 text-[#7a5c43]/40 mb-6" />

          {/* Text */}
          <p
            className="
  text-lg md:text-xl
  leading-relaxed
  text-[#4b372a]
  max-w-3xl
  mb-10
  min-h-[140px]
  line-clamp-4
"
          >
            {review.text}
          </p>

          {/* User */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#7a5c43] text-white flex items-center justify-center font-semibold">
              {review.avatar}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[#4b372a]">{review.name}</p>

                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#c28b48] text-[#c28b48]"
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-[#6b5a4d]">
                {review.location} · {review.product}
              </p>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prevReview}
              className="w-9 h-9 rounded-full border border-[#7a5c43]/40 flex items-center justify-center hover:bg-[#7a5c43]/10 transition"
            >
              <ChevronLeft className="w-4 h-4 text-[#4b372a]" />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i === currentIndex ? "bg-[#7a5c43]" : "bg-[#7a5c43]/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="w-9 h-9 rounded-full border border-[#7a5c43]/40 flex items-center justify-center hover:bg-[#7a5c43]/10 transition"
            >
              <ChevronRight className="w-4 h-4 text-[#4b372a]" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center mt-20">
          {[
            ["10K+", "Happy Customers"],
            ["120+", "Products"],
            ["4.9", "Average Ratings"],
            ["8", "Years In Business"],
          ].map(([num, label]) => (
            <div key={label}>
              <p className="font-serif text-4xl text-[#4b372a] mb-2">{num}</p>
              <p className="text-[#6b5a4d] text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
