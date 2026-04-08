"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, MapPin, Building, Lightbulb, Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib_supabase/cart-context";
import { AuthGuard } from "@/components/auth-guard";

const mapTypes = [
  {
    id: "world",
    label: "World Map",
    description: "Complete world view with all continents",
    icon: Globe,
    basePrice: 299,
    image: "/images/world-map.jpg",
  },
  {
    id: "country",
    label: "Country Map",
    description: "Detailed map of a single country",
    icon: MapPin,
    basePrice: 249,
    image: "/images/country-map.jpg",
  },
  {
    id: "city",
    label: "City Map",
    description: "Intricate street-level city map",
    icon: Building,
    basePrice: 189,
    image: "/images/city-map.jpg",
  },
];

const sizeOptions = [
  { id: "small", label: "Small", dimensions: "30 x 20 cm", multiplier: 1 },
  { id: "medium", label: "Medium", dimensions: "60 x 40 cm", multiplier: 1.5 },
  { id: "large", label: "Large", dimensions: "90 x 60 cm", multiplier: 2 },
  { id: "xl", label: "Extra Large", dimensions: "120 x 80 cm", multiplier: 2.8 },
];

const woodColors = [
  { id: "natural", label: "Natural Oak", color: "#C4A77D" },
  { id: "walnut", label: "Dark Walnut", color: "#5C4033" },
  { id: "white", label: "White Wash", color: "#E8E4DC" },
  { id: "ebony", label: "Ebony Black", color: "#2C2C2C" },
];

const languages = [
  { id: "en", label: "English" },
  { id: "de", label: "German" },
  { id: "fr", label: "French" },
  { id: "es", label: "Spanish" },
  { id: "it", label: "Italian" },
  { id: "none", label: "No Labels" },
];

const LED_PRICE = 75;

export default function CustomizePage() {
  const [mapType, setMapType] = useState("world");
  const [size, setSize] = useState("medium");
  const [woodColor, setWoodColor] = useState("natural");
  const [language, setLanguage] = useState("en");
  const [hasLED, setHasLED] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const selectedMapType = mapTypes.find((m) => m.id === mapType)!;
  const selectedSize = sizeOptions.find((s) => s.id === size)!;
  const selectedWoodColor = woodColors.find((w) => w.id === woodColor)!;

  const totalPrice = useMemo(() => {
    const base = selectedMapType.basePrice * selectedSize.multiplier;
    const led = hasLED ? LED_PRICE : 0;
    return Math.round(base + led);
  }, [selectedMapType, selectedSize, hasLED]);

  const handleAddToCart = () => {
    addToCart({
      id: `custom-${Date.now()}`, // Generate unique ID for custom map
      name: `Custom ${selectedMapType.label}`,
      price: totalPrice,
      quantity: 1,
      image: selectedMapType.image,
      size: `${selectedSize.label} (${selectedSize.dimensions})`,
      color: selectedWoodColor.label
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-background">
        <Header />

        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-secondary">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-accent text-sm uppercase tracking-[0.2em] mb-3 font-medium">
              Create Your Own
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4 text-balance">
              Design Your Custom Map
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Build your perfect wooden map with our interactive configurator. Choose your map type, size, wood color, and more.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="order-2 lg:order-1 space-y-8">
                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                    1. Select Map Type
                  </h2>
                  <RadioGroup value={mapType} onValueChange={setMapType} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {mapTypes.map((type) => (
                      <div key={type.id}>
                        <RadioGroupItem value={type.id} id={`type-${type.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`type-${type.id}`}
                          className="flex flex-col items-center justify-center p-6 border border-border rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/5 hover:border-muted-foreground"
                        >
                          <type.icon className="w-8 h-8 text-accent mb-3" />
                          <span className="font-medium text-foreground">{type.label}</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            {type.description}
                          </span>
                          <span className="text-sm text-accent mt-2">From ${type.basePrice}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                    2. Choose Size
                  </h2>
                  <RadioGroup value={size} onValueChange={setSize} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {sizeOptions.map((option) => (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={`size-${option.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`size-${option.id}`}
                          className="flex flex-col items-center justify-center p-4 border border-border rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/5 hover:border-muted-foreground"
                        >
                          <span className="font-medium text-foreground">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.dimensions}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                    3. Select Wood Color
                  </h2>
                  <RadioGroup value={woodColor} onValueChange={setWoodColor} className="flex flex-wrap gap-4">
                    {woodColors.map((option) => (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={`color-${option.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`color-${option.id}`}
                          className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-accent hover:border-muted-foreground"
                        >
                          <div
                            className="w-12 h-12 rounded-full border border-border"
                            style={{ backgroundColor: option.color }}
                          />
                          <span className="text-sm text-muted-foreground">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                    4. Choose Label Language
                  </h2>
                  <RadioGroup value={language} onValueChange={setLanguage} className="flex flex-wrap gap-3">
                    {languages.map((option) => (
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
                  <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                    5. Add-ons
                  </h2>
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <label className="flex items-start gap-4 cursor-pointer">
                        <Checkbox
                          checked={hasLED}
                          onCheckedChange={(checked) => setHasLED(checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Lightbulb className="w-5 h-5 text-accent" />
                            <span className="font-medium text-foreground">LED Backlighting</span>
                            <span className="text-accent text-sm">+${LED_PRICE}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Add warm LED lights behind your map for a stunning ambient glow.
                            Includes USB power adapter and remote control dimmer.
                          </p>
                        </div>
                      </label>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="lg:sticky lg:top-24 space-y-6">
                  <Card className="overflow-hidden border-border">
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={selectedMapType.image || "/placeholder.svg"}
                        alt="Map Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/5">
                        <div className="bg-background/90 backdrop-blur-sm px-6 py-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground mb-1">Preview</p>
                          <p className="font-serif text-lg text-foreground">{selectedMapType.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedSize.dimensions} &middot; {woodColors.find((c) => c.id === woodColor)?.label}
                          </p>
                          {hasLED && (
                            <p className="text-sm text-accent mt-1 flex items-center justify-center gap-1">
                              <Lightbulb className="w-4 h-4" /> LED Included
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                        Order Summary
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Map Type</span>
                          <span className="text-foreground">{selectedMapType.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Size</span>
                          <span className="text-foreground">{selectedSize.label} ({selectedSize.dimensions})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Wood Color</span>
                          <span className="text-foreground">{woodColors.find((c) => c.id === woodColor)?.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Label Language</span>
                          <span className="text-foreground">{languages.find((l) => l.id === language)?.label}</span>
                        </div>
                        {hasLED && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">LED Backlighting</span>
                            <span className="text-foreground">+${LED_PRICE}</span>
                          </div>
                        )}
                        <div className="border-t border-border pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-foreground">Total</span>
                            <span className="text-2xl font-semibold text-foreground">${totalPrice}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="lg"
                        className="w-full mt-6 py-6 text-base bg-[#8b5a3c] hover:bg-[#6d4830]"
                        onClick={handleAddToCart}
                        disabled={addedToCart}
                      >
                        {addedToCart ? (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Added to Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add Custom Map to Cart
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center mt-4">
                        Custom maps are made to order and ship within 2-3 weeks
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </AuthGuard>
  );
}