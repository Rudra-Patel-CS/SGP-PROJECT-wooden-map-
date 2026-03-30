"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Truck, Shield, Package, Minus, Plus, ChevronRight, Check, ShoppingCart, Zap, Loader2 } from "lucide-react";
import { useCart } from "@/lib_supabase/cart-context";
import { createClient } from "@/lib_supabase/supabase/client";

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

const sizeOptions = [
  { id: "small", label: "Small", dimensions: "30 x 20 cm", price: 0 },
  { id: "medium", label: "Medium", dimensions: "60 x 40 cm", price: 50 },
  { id: "large", label: "Large", dimensions: "90 x 60 cm", price: 100 },
  { id: "xl", label: "XL", dimensions: "120 x 80 cm", price: 200 },
];

const colorOptions = [
  { id: "natural", label: "Natural Oak", color: "#C4A77D" },
  { id: "walnut", label: "Dark Walnut", color: "#5C4033" },
  { id: "white", label: "White Wash", color: "#E8E4DC" },
];

const languageOptions = [
  { id: "en", label: "English" },
  { id: "de", label: "German" },
  { id: "fr", label: "French" },
  { id: "es", label: "Spanish" },
];

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("medium");
  const [selectedColor, setSelectedColor] = useState("natural");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

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

  // Build images list from product data
  const allImages = product.images && product.images.length > 0
    ? product.images
    : product.image_url
      ? [product.image_url]
      : ["/placeholder.svg"];

  const sizePrice = sizeOptions.find((s) => s.id === selectedSize)?.price || 0;
  const totalPrice = product.price + sizePrice;

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

    const selectedSizeOption = sizeOptions.find((s) => s.id === selectedSize);
    const selectedColorOption = colorOptions.find((c) => c.id === selectedColor);

    addToCart({
      id: parseInt(product.id) || Date.now(),
      name: product.name,
      price: totalPrice,
      quantity: quantity,
      image: allImages[0],
      size: `${selectedSizeOption?.label} (${selectedSizeOption?.dimensions})`,
      color: selectedColorOption?.label || "Natural Oak"
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async () => {
    const isAuthed = await checkAuth();
    if (!isAuthed) return;

    const selectedSizeOption = sizeOptions.find((s) => s.id === selectedSize);
    const selectedColorOption = colorOptions.find((c) => c.id === selectedColor);

    addToCart({
      id: parseInt(product.id) || Date.now(),
      name: product.name,
      price: totalPrice,
      quantity: quantity,
      image: allImages[0],
      size: `${selectedSizeOption?.label} (${selectedSizeOption?.dimensions})`,
      color: selectedColorOption?.label || "Natural Oak"
    });

    router.push("/cart");
  };

  // Fetch related products (we can show some placeholder for now)
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
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                {allImages[selectedImage] && allImages[selectedImage] !== "/placeholder.svg" ? (
                  <img
                    src={allImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#f3ebe2] text-[#8b5a3c]">
                    <span className="text-sm">No Image</span>
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-lg bg-muted ${selectedImage === index ? "ring-2 ring-accent" : ""
                        }`}
                    >
                      <img src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
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
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
                {product.name}
              </h1>

              <p className="text-3xl font-semibold text-foreground mb-6">${totalPrice}</p>

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
                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">Size</Label>
                  <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="grid grid-cols-2 gap-3">
                    {sizeOptions.map((option) => (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                        <Label
                          htmlFor={option.id}
                          className="flex flex-col items-center justify-center p-4 border border-border rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/5 hover:border-muted-foreground"
                        >
                          <span className="font-medium text-foreground">{option.label}</span>
                          <span className="text-sm text-muted-foreground">{option.dimensions}</span>
                          {option.price > 0 && (
                            <span className="text-sm text-accent mt-1">+${option.price}</span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">Wood Color</Label>
                  <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-3">
                    {colorOptions.map((option) => (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={`color-${option.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`color-${option.id}`}
                          className="flex flex-col items-center gap-2 p-3 border border-border rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-accent hover:border-muted-foreground"
                        >
                          <div className="w-8 h-8 rounded-full border border-border" style={{ backgroundColor: option.color }} />
                          <span className="text-xs text-muted-foreground">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">Label Language</Label>
                  <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage} className="flex flex-wrap gap-3">
                    {languageOptions.map((option) => (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={`lang-${option.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`lang-${option.id}`}
                          className="px-4 py-2 border border-border rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/5 hover:border-muted-foreground text-sm text-foreground"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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
                  className="w-full py-6 text-base bg-[#8b5a3c] hover:bg-[#6d4830]"
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
                      Add to Cart - ${totalPrice * quantity}
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  className="w-full py-6 text-base bg-[#8b5a3c] hover:bg-[#6d4830]"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Buy Now - ${totalPrice * quantity}
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-border space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="w-5 h-5 text-accent" />
                  <span>Free shipping on orders over ₹2000</span>
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
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 mb-8">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
              >
                Shipping & Delivery
              </TabsTrigger>
              <TabsTrigger
                value="installation"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
              >
                Installation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <div className="prose prose-neutral max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
                {product.features && product.features.length > 0 && (
                  <>
                    <h3 className="font-serif text-xl text-foreground mb-4">Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-muted-foreground">
                          <Check className="w-5 h-5 text-accent shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-0">
              <div className="prose prose-neutral max-w-none">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, value], i) => (
                          <tr key={key} className={i % 2 === 0 ? 'bg-muted/30' : 'bg-background'}>
                            <td className="px-6 py-4 text-sm font-medium text-foreground w-1/3 border-r border-border">
                              {key}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specifications available for this product.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-0">
              <div className="prose prose-neutral max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We ship worldwide with care to ensure your map arrives in perfect condition.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    Free shipping on orders over ₹2000
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    Standard delivery: 7-14 business days
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    Express delivery: 3-5 business days (+₹250)
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    Secure, custom packaging for safe transit
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="installation" className="mt-0">
              <div className="prose prose-neutral max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Every map comes with everything you need for easy installation.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    Wall mounting template included
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    Hidden hanging system for clean look
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    Step-by-step video guide available
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    Customer support available if needed
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
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
                <p className="text-foreground font-semibold mt-1">${item.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
