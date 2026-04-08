"use client";

import { useState, useMemo, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Star, SlidersHorizontal, X, ChevronLeft, ChevronRight, ShoppingCart, Zap, Loader2 } from "lucide-react";
import { useCart } from "@/lib_supabase/cart-context";
import { createClient } from "@/lib_supabase/supabase/client";
import { useSettings } from "@/components/settings-context";
import { formatPrice } from "@/lib_supabase/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews_count: number;
  image_url: string | null;
  size: string;
  category: string;
  badge: string | null;
  created_at: string;
}

const sizeFilters = [
  { id: "small", label: "Small (30x20 cm)" },
  { id: "medium", label: "Medium (60x40 cm)" },
  { id: "large", label: "Large (90x60 cm)" },
  { id: "xl", label: "Extra Large (120x80 cm)" },
];

const regionFilters = [
  { id: "world", label: "World Maps" },
  { id: "country", label: "Country Maps" },
  { id: "city", label: "City Maps" },
];

const ITEMS_PER_PAGE = 12;

export default function ShopPage() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  // Pending (user is editing) state
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 200000]);

  // Applied (used for actual filtering) state
  const [appliedSizes, setAppliedSizes] = useState<string[]>([]);
  const [appliedRegions, setAppliedRegions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("featured");
  const { addToCart } = useCart();
  const router = useRouter();

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          
          // Dynamically set max price based on actual inventory
          const actualMaxProductPrice = Math.max(...data.map((p: any) => p.price), 0);
          const filterMax = Math.max(actualMaxProductPrice, 200000);
          setTempPriceRange([0, filterMax]);
          setPriceRange([0, filterMax]);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);


  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSize = appliedSizes.length === 0 || appliedSizes.includes(product.size);
      const matchesRegion = appliedRegions.length === 0 || appliedRegions.includes(product.category);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSize && matchesRegion && matchesPrice;
    });

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating-high-low":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low-high":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "name-a-z":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-z-a":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "featured":
      default:
        break;
    }

    return filtered;
  }, [products, appliedSizes, appliedRegions, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const applyFilters = () => {
    setAppliedSizes(selectedSizes);
    setAppliedRegions(selectedRegions);
    setPriceRange([...tempPriceRange]);
    setCurrentPage(1);
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedRegions([]);
    setTempPriceRange([0, 50000]);
    setAppliedSizes([]);
    setAppliedRegions([]);
    setPriceRange([0, 50000]);
    setCurrentPage(1);
  };

  // True when pending selections differ from applied
  const hasPendingChanges =
    JSON.stringify(selectedSizes) !== JSON.stringify(appliedSizes) ||
    JSON.stringify(selectedRegions) !== JSON.stringify(appliedRegions) ||
    tempPriceRange[0] !== priceRange[0] ||
    tempPriceRange[1] !== priceRange[1];

  const hasActiveFilters =
    appliedSizes.length > 0 || appliedRegions.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000000;

  const checkAuthAndRun = async (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault();
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    callback();
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    checkAuthAndRun(e, () => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image_url || "/placeholder.svg",
        size: product.size === "small" ? "Small (30x20 cm)" :
          product.size === "medium" ? "Medium (60x40 cm)" :
            product.size === "large" ? "Large (90x60 cm)" :
              "Extra Large (120x80 cm)",
        color: "Natural Oak"
      });
    });
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    checkAuthAndRun(e, () => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image_url || "/placeholder.svg",
        size: product.size === "small" ? "Small (30x20 cm)" :
          product.size === "medium" ? "Medium (60x40 cm)" :
            product.size === "large" ? "Large (90x60 cm)" :
              "Extra Large (120x80 cm)",
        color: "Natural Oak"
      });
      router.push("/cart");
    });
  };

  const FiltersContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-foreground mb-4">Size</h3>
        <div className="space-y-3">
          {sizeFilters.map((filter) => (
            <label key={filter.id} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedSizes.includes(filter.id)}
                onCheckedChange={() => toggleSize(filter.id)}
              />
              <span className="text-sm text-muted-foreground">{filter.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Region</h3>
        <div className="space-y-3">
          {regionFilters.map((filter) => (
            <label key={filter.id} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedRegions.includes(filter.id)}
                onCheckedChange={() => toggleRegion(filter.id)}
              />
              <span className="text-sm text-muted-foreground">{filter.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Price Range</h3>
          {(tempPriceRange[0] > 0 || tempPriceRange[1] < 1000000) && (
            <button
              onClick={() => setTempPriceRange([0, 50000])}
              className="text-xs text-[#8b5a3c] hover:text-[#6d4830] transition-colors"
            >
              Reset
            </button>
          )}
        </div>
        <div className="px-2 pt-4 pb-2">
          <Slider
            min={0}
            max={1000000}
            step={1000}
            value={tempPriceRange}
            onValueChange={setTempPriceRange}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="bg-white border border-[#d4b896] rounded px-3 py-1.5 text-sm w-24 text-center">
            {formatPrice(tempPriceRange[0], settings.currency)}
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="bg-white border border-[#d4b896] rounded px-3 py-1.5 text-sm w-24 text-center">
            {tempPriceRange[1] >= 1000000 ? `${formatPrice(1000000, settings.currency)}+` : formatPrice(tempPriceRange[1], settings.currency)}
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button
        onClick={applyFilters}
        className="w-full relative bg-[#8b5a3c] hover:bg-[#6d4830] text-white"
      >
        Apply Filters
        {hasPendingChanges && (
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400" />
        )}
      </Button>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent border-[#d4b896] text-[#5a3726] hover:bg-[#f7f1e8]">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground text-center mb-4">
            Shop All Maps
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Discover our collection of handcrafted wooden maps, from sweeping world views to intricate city streets.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <p className="text-muted-foreground">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <label className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:w-48 h-10 px-3 py-2 text-sm rounded-md border border-[#d4b896] bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-[#8b5a3c] focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating-high-low">Rating: High to Low</option>
                  <option value="rating-low-high">Rating: Low to High</option>
                  <option value="name-a-z">Name: A to Z</option>
                  <option value="name-z-a">Name: Z to A</option>
                </select>
              </div>
              <Button
                variant="outline"
                className="lg:hidden bg-transparent border-[#d4b896]"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="flex gap-12">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <h2 className="font-serif text-xl font-medium text-foreground mb-6">Filters</h2>
                <FiltersContent />
              </div>
            </aside>

            <div className="flex-1">
              {loadingProducts ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#8b5a3c]" />
                  <p>Loading products...</p>
                </div>
              ) : paginatedProducts.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground">
                  <p className="text-lg mb-2">No products found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group animate-in fade-in duration-300"
                    >
                      <Link href={`/product/${product.id}`}>
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-4">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#f3ebe2] text-[#8b5a3c]">
                              <span className="text-sm">No Image</span>
                            </div>
                          )}
                          {(() => {
                            const isNew = (date: string) => {
                              const created = new Date(date).getTime();
                              const now = new Date().getTime();
                              return (now - created) < (48 * 60 * 60 * 1000); // 48 hours
                            };
                            if (isNew(product.created_at)) {
                              return (
                                <span className="absolute top-3 left-3 bg-[#8b5a3c] text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
                                  New Arrival
                                </span>
                              );
                            } else if (product.badge) {
                              return (
                                <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full z-10">
                                  {product.badge}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="text-sm font-medium text-foreground">{product.rating || 0}</span>
                          <span className="text-sm text-muted-foreground">({product.reviews_count || 0})</span>
                        </div>
                        <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-lg font-semibold text-foreground mt-1">{formatPrice(product.price, settings.currency)}</p>
                      </Link>
                      <div className="flex gap-2 mt-3">
                        <Button
                          className="flex-1 bg-[#8b5a3c] hover:bg-[#6d4830] text-white"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          className="flex-1 bg-[#8b5a3c] hover:bg-[#6d4830] text-white"
                          onClick={(e) => handleBuyNow(e, product)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-background p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-medium text-foreground">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <FiltersContent />
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
