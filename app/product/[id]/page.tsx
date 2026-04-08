"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, Truck, Shield, Package, Minus, Plus, ChevronLeft, ChevronRight, Check, ShoppingCart, Zap, Loader2, X, Maximize2, Heart, Search } from "lucide-react";
import { useCart } from "@/lib_supabase/cart-context";
import { createClient } from "@/lib_supabase/supabase/client";
import { MAP_SIZES, normalizeSizeId } from "@/lib_supabase/constants";
import { ReviewSection } from "@/components/reviews/review-section";
import { useSettings } from "@/components/settings-context";
import { formatPrice } from "@/lib_supabase/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews_count: number;
  image_url: string | null;
  images: string[];
  description: string;
  features: string[];
  category: string;
  size: string;
  badge: string | null;
  stock: number;
  specifications: Record<string, string> | null;
}

export default function ProductPage() {
  const { settings } = useSettings();
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(""); 

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const checkWatchlist = useCallback(async () => {
    if (!user || !productId) return;
    try {
      const res = await fetch(`/api/watchlist?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        const exists = data.some((item: any) => item.product_id === productId);
        setIsWatchlisted(exists);
      }
    } catch (error) {
      console.error("Error checking watchlist:", error);
    }
  }, [user, productId]);

  const toggleWatchlist = async () => {
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }
    setWatchlistLoading(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, user_id: user.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsWatchlisted(data.status === "added");
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    } finally {
      setWatchlistLoading(false);
    }
  };

  useEffect(() => {
    if (user && productId) {
      checkWatchlist();
    }
  }, [user, productId, checkWatchlist]);

  // Fetch product from Supabase
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Set default size after product is loaded
  useEffect(() => {
    if (product) {
      const dbSize = normalizeSizeId(product.size);
      if (dbSize === "all") {
        setSelectedSize("xs"); // Default to smallest for 'all'
      } else {
        setSelectedSize(dbSize);
      }
    }
  }, [product]);

  // Build images list from product data
  const allImages = (product?.images && product.images.length > 0)
    ? product.images
    : (product?.image_url
      ? [product.image_url]
      : ["/placeholder.svg"]);

  // Auto-slide logic (3 seconds)
  useEffect(() => {
    if (!product || !allImages || allImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [product, allImages, selectedImage]); 

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#8b5a3c]" />
          <p>Loading product details...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <p className="text-xl mb-4">Product not found</p>
          <Link href="/shop" className="text-[#8b5a3c] hover:underline">
            ← Back to Shop
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Filter sizes based on product availability
  const dbSizeId = normalizeSizeId(product.size);
  const availableSizes = dbSizeId === 'all' 
    ? MAP_SIZES 
    : MAP_SIZES.filter(s => s.id === dbSizeId);

  const currentSizeData = MAP_SIZES.find(s => s.id === selectedSize) || availableSizes[0] || MAP_SIZES[0];
  const totalPrice = currentSizeData.price;

  const checkAuth = async (): Promise<boolean> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    const isAuthed = await checkAuth();
    if (!isAuthed) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: totalPrice,
      quantity: quantity,
      image: allImages[0],
      size: `${currentSizeData.label} (${currentSizeData.dimensions})`,
      color: "Natural Oak"
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async () => {
    const isAuthed = await checkAuth();
    if (!isAuthed) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: totalPrice,
      quantity: quantity,
      image: allImages[0],
      size: `${currentSizeData.label} (${currentSizeData.dimensions})`,
      color: "Natural Oak"
    });

    router.push("/cart");
  };

  const relatedProducts = [
    { id: "1", name: "Classic World Map", price: 299, image: "/world-map-1.jpeg" },
    { id: "2", name: "LED Europe Map", price: 349, image: "/world-map-2.jpeg" },
    { id: "3", name: "Rustic India Map", price: 199, image: "/country-map-1.jpeg" },
    { id: "4", name: "3D Wall World Map", price: 279, image: "/world-map-room.jpeg" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
                {(() => {
                  const mediaUrl = allImages[selectedImage];
                  const isVideo = (url: string) => url && /\.(mp4|webm|ogg)$/i.test(url);
                  
                  if (isVideo(mediaUrl)) {
                    return (
                      <video
                        src={mediaUrl}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        muted
                        loop
                      />
                    );
                  } else if (mediaUrl && mediaUrl !== "/placeholder.svg") {
                    return (
                      <div 
                        className="relative w-full h-full cursor-zoom-in group/img"
                        onClick={() => {
                          setLightboxIndex(selectedImage);
                          setShowLightbox(true);
                        }}
                      >
                        <img
                          src={mediaUrl}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/90 p-2 rounded-full shadow-lg transform scale-90 group-hover/img:scale-100 transition-transform">
                            <Maximize2 className="w-5 h-5 text-[#8b5a3c]" />
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-[#f3ebe2] text-[#8b5a3c]">
                         <span className="text-sm">No Image</span>
                      </div>
                    );
                  }
                })()}

                {allImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedImage(prev => (prev - 1 + allImages.length) % allImages.length);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#2b1a12] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedImage(prev => (prev + 1) % allImages.length);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#2b1a12] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {allImages.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${selectedImage === i ? "bg-[#8b5a3c] w-4" : "bg-white/60"}`}
                    />
                  ))}
                </div>
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {allImages.map((image, index) => {
                    const isVideo = (url: string) => url && /\.(mp4|webm|ogg)$/i.test(url);
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square overflow-hidden rounded-lg bg-muted flex items-center justify-center ${selectedImage === index ? "ring-2 ring-[#8b5a3c]" : "ring-1 ring-[#e6dcd0]"
                          }`}
                      >
                        {isVideo(image) ? (
                          <div className="w-full h-full bg-[#2b1a12] flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold">VIDEO</span>
                          </div>
                        ) : (
                          <img src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? "fill-accent text-accent" : "text-muted"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">{product.rating || 0}</span>
                <span className="text-sm text-muted-foreground">({product.reviews_count || 0} reviews)</span>

                <button
                  onClick={toggleWatchlist}
                  disabled={watchlistLoading}
                  className="ml-auto p-2 rounded-full hover:bg-red-50 transition-colors group"
                  title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
                >
                  {watchlistLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted" />
                  ) : (
                    <Heart
                      className={`w-5 h-5 transition-all ${
                        isWatchlisted 
                          ? "fill-red-500 text-red-500 scale-110" 
                          : "text-muted-foreground group-hover:text-red-400 group-hover:scale-110"
                      }`}
                    />
                  )}
                </button>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
                {product.name}
              </h1>

              <p className="text-3xl font-semibold text-foreground mb-6">{formatPrice(totalPrice, settings.currency)}</p>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
              )}

              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-sm text-orange-600 mb-4">Only {product.stock} left in stock!</p>
              )}

              {product.stock === 0 && (
                <p className="text-sm text-red-600 mb-4 font-medium">Out of stock</p>
              )}

              <div className="space-y-6 mb-8">
                {/* Premium Size Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold text-[#2b1a12] tracking-wide uppercase">Select Map Scale</Label>
                    <span className="text-[10px] font-semibold text-[#8b5a3c] bg-[#fdf8f2] px-3 py-1 rounded-full border border-[#e6dcd0] shadow-sm italic">
                      Installation Included Free
                    </span>
                  </div>
                  
                  <div className="relative pt-2 pb-2">
                    {/* Horizontal Ribbon Picker */}
                    <div className="flex items-center justify-between gap-2 p-1.5 bg-[#f7f1e8] rounded-2xl border border-[#e6dcd0] shadow-inner relative overflow-x-auto no-scrollbar">
                      {MAP_SIZES.map((option) => {
                        const isAvailable = availableSizes.some(s => s.id === option.id);
                        const isSelected = selectedSize === option.id;
                        
                        return (
                          <button
                            key={option.id}
                            disabled={!isAvailable}
                            onClick={() => setSelectedSize(option.id)}
                            className={`flex-1 min-w-[70px] relative py-4 px-2 rounded-xl transition-all duration-500 flex flex-col items-center justify-center gap-1.5 group
                              ${isSelected 
                                ? "bg-[#8b5a3c] text-white shadow-[0_4px_12px_rgba(139,90,60,0.3)] transform -translate-y-1 scale-105 z-10" 
                                : isAvailable 
                                  ? "hover:bg-[#e6dcd0] text-[#5a3726] hover:-translate-y-0.5" 
                                  : "opacity-20 cursor-not-allowed grayscale"
                              }`}
                          >
                            <span className={`text-base font-black leading-none ${isSelected ? "text-white" : "text-[#2b1a12]"}`}>{option.label}</span>
                            <div className="flex flex-col items-center leading-tight">
                              <span className={`text-[9px] font-bold uppercase tracking-tight ${isSelected ? "text-white/90" : "text-[#8b5a3c]"}`}>{option.dimensions.split(' ')[0]} {option.dimensions.split(' ')[1]}</span>
                              <span className={`text-[7px] font-medium opacity-80 ${isSelected ? "text-white/70" : "text-[#8b5a3c]/70"}`}>{option.dimensions.split(' ').slice(2).join(' ')}</span>
                            </div>
                            
                            {/* Visual Feedback for Price on Select */}
                            {isSelected && (
                              <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
                                <span className="text-[11px] font-black text-[#8b5a3c] bg-white px-3 py-1 rounded-full border border-[#e6dcd0] shadow-xl">
                                  {formatPrice(option.price, settings.currency)}
                                </span>
                              </div>
                            )}
                            
                            {/* Tooltip for Dimensions on Hover */}
                            {isAvailable && !isSelected && (
                               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all opacity-0 group-hover:opacity-100 bg-[#2b1a12] text-white text-[10px] px-3 py-1.5 rounded-lg shadow-2xl z-50 pointer-events-none whitespace-nowrap border border-white/10 font-bold">
                                  {option.dimensions} · {formatPrice(option.price, settings.currency)}
                               </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">Quantity</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity === 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity((q) => q + 1)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full py-6 text-base font-semibold text-white bg-[#8b5a3c] hover:bg-[#6d4830] transition-all duration-300 hover:shadow-lg shadow-md"
                  onClick={handleAddToCart}
                  disabled={addedToCart || product.stock === 0}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart - {formatPrice(totalPrice * quantity, settings.currency)}
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  className="w-full py-6 text-base font-semibold text-white bg-[#5a3726] hover:bg-[#3d2519] transition-all duration-300 hover:shadow-lg shadow-md"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Buy Now - {formatPrice(totalPrice * quantity, settings.currency)}
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-border space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="w-5 h-5 text-accent" />
                  <span>Free shipping on orders over {formatPrice(2000, settings.currency)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-accent" />
                  <span>5-year warranty on all products</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Package className="w-5 h-5 text-accent" />
                  <span>Easy wall mounting - hardware included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-[#e6dcd0] overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5a3c] to-[#5a3726] flex items-center justify-center shadow-md">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#2b1a12]">Description &amp; Features</h2>
              </div>
              <p className="text-[#5a3726] leading-relaxed text-base mb-6">{product.description}</p>
              {product.features && product.features.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 bg-[#fffaf3] px-4 py-3 rounded-xl border border-[#f3ebe2]">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8b5a3c] to-[#a0724e] flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[#2b1a12] font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <>
                <div className="mx-8 md:mx-10 h-px bg-gradient-to-r from-transparent via-[#e6dcd0] to-transparent" />
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5a3c] to-[#5a3726] flex items-center justify-center shadow-md">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-[#2b1a12]">Specifications</h2>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-[#e6dcd0]">
                    <table className="w-full">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, value], i) => (
                          <tr key={key} className={`${i % 2 === 0 ? 'bg-[#fffaf3]' : 'bg-white'} border-b border-[#f3ebe2] last:border-b-0`}>
                            <td className="px-6 py-4 text-sm font-semibold text-[#8b5a3c] w-2/5">
                              {key}
                            </td>
                            <td className="px-6 py-4 text-sm text-[#2b1a12] font-medium">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            <div className="mx-8 md:mx-10 h-px bg-gradient-to-r from-transparent via-[#e6dcd0] to-transparent" />
            <div className="p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#fffaf3] p-6 rounded-2xl border border-[#f3ebe2]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5a3c] to-[#5a3726] flex items-center justify-center shadow-md">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#2b1a12]">Shipping &amp; Delivery</h3>
                  </div>
                  <p className="text-[#5a3726] mb-5 text-sm leading-relaxed">
                    We ship worldwide with care to ensure your map arrives in perfect condition.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Free shipping on orders over " + formatPrice(2000, settings.currency),
                      "Standard delivery: 7-14 business days",
                      "Express delivery: 3-5 business days (+" + formatPrice(250, settings.currency) + ")",
                      "Secure, custom packaging for safe transit"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#2b1a12]">
                        <div className="w-5 h-5 rounded-full bg-white border border-[#e6dcd0] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <Check className="w-3 h-3 text-[#8b5a3c]" />
                        </div>
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#fffaf3] p-6 rounded-2xl border border-[#f3ebe2]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5a3c] to-[#5a3726] flex items-center justify-center shadow-md">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#2b1a12]">Installation</h3>
                  </div>
                  <p className="text-[#5a3726] mb-5 text-sm leading-relaxed">
                    Every map comes with everything you need for easy installation at home.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Wall mounting stencil template included",
                      "Double-sided adhesive tape provided",
                      "Step-by-step video guide available",
                      "Customer support available if needed"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#2b1a12]">
                        <div className="w-5 h-5 rounded-full bg-white border border-[#e6dcd0] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <Check className="w-3 h-3 text-[#8b5a3c]" />
                        </div>
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Product Reviews Section */}
          <ReviewSection 
            productId={product.id} 
            initialRating={product.rating || 0} 
            initialCount={product.reviews_count || 0} 
          />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/product/${item.id}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#f3ebe2] text-[#8b5a3c] text-sm">No Image</div>
                  )}
                </div>
                <h3 className="font-medium text-foreground group-hover:text-accent transition-colors text-sm">
                  {item.name}
                </h3>
                <p className="text-foreground font-semibold mt-1">{formatPrice(item.price, settings.currency)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox Modal */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowLightbox(false);
            if (e.key === "ArrowLeft") setLightboxIndex(prev => (prev - 1 + allImages.length) % allImages.length);
            if (e.key === "ArrowRight") setLightboxIndex(prev => (prev + 1) % allImages.length);
          }}
          tabIndex={0}
        >
          <button 
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-[110]"
          >
            <X className="w-6 h-6" />
          </button>

          {allImages.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => (prev - 1 + allImages.length) % allImages.length);
                }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-[110]"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => (prev + 1) % allImages.length);
                }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-[110]"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={() => setShowLightbox(false)}>
            <div className="relative max-w-full max-h-full aspect-auto" onClick={(e) => e.stopPropagation()}>
               {(() => {
                  const mediaUrl = allImages[lightboxIndex];
                  const isVideo = (url: string) => url && /\.(mp4|webm|ogg)$/i.test(url);
                  
                  if (isVideo(mediaUrl)) {
                    return (
                      <video
                        src={mediaUrl}
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        controls
                        autoPlay
                        muted
                        loop
                      />
                    );
                  } else {
                    return (
                      <img
                        src={mediaUrl}
                        alt={product.name}
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
                      />
                    );
                  }
               })()}
               
               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium whitespace-nowrap">
                  {product.name} &middot; {lightboxIndex + 1} / {allImages.length}
               </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
