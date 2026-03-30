import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturedCollections } from "@/components/featured-collections";
import { WhyChooseUs } from "@/components/why-choose-us";
import { BestSellers } from "@/components/best-sellers";
import { CustomerReviews } from "@/components/customer-reviews";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      {/* Site Header */}
      <Header />

      {/* Main Content */}
      <main className="min-h-screen overflow-x-hidden">
        {/* HERO */}
        <section aria-label="Hero">
          <HeroSection />
        </section>

        {/* COLLECTIONS */}
        <section aria-label="Featured Collections">
          <FeaturedCollections />
        </section>

        {/* WHY CHOOSE US */}
        <section aria-label="Why Choose Aryam Maps">
          <WhyChooseUs />
        </section>

        {/* BEST SELLERS */}
        <section aria-label="Best Selling Products">
          <BestSellers />
        </section>

        {/* REVIEWS */}
        <section aria-label="Customer Reviews">
          <CustomerReviews />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
