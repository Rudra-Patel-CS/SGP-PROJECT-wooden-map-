"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Check,
  Truck,
  Loader2,
} from "lucide-react";
import { useCart } from "@/lib_supabase/cart-context";
import { AuthGuard } from "@/components/auth-guard";
import { createClient } from "@/lib_supabase/supabase/client";
import { useSettings } from "@/components/settings-context";
import { formatPrice } from "@/lib_supabase/utils";
import { RazorpayCheckout } from "@/components/razorpay-checkout";

const GEO_DATA: Record<string, Record<string, Record<string, string[]>>> = {
  India: {
    Gujarat: {
      Ahmedabad: [
        "Ahmedabad City",
        "Bavla",
        "Daskroi",
        "Detroj-Rampura",
        "Dhandhuka",
        "Dholera",
        "Dholka",
        "Mandal",
        "Sanand",
        "Viramgam",
      ],
      Amreli: [
        "Amreli",
        "Babra",
        "Bagasara",
        "Dhari",
        "Jafrabad",
        "Khambha",
        "Kunkavav",
        "Lilia",
        "Rajula",
        "Savarkundla",
      ],
      Anand: [
        "Anand",
        "Anklav",
        "Borsad",
        "Khambhat",
        "Petlad",
        "Sojitra",
        "Tarapur",
        "Umreth",
      ],
      Aravalli: ["Bayad", "Bhiloda", "Dhansura", "Malpur", "Meghraj", "Modasa"],
      Banaskantha: [
        "Amirgadh",
        "Bhabhar",
        "Dantiwada",
        "Danta",
        "Deesa",
        "Deodar",
        "Dhanera",
        "Kankrej",
        "Lakhani",
        "Palanpur",
        "Suigam",
        "Tharad",
        "Vadgam",
        "Vav",
      ],
      Bharuch: [
        "Bharuch",
        "Amod",
        "Ankleshwar",
        "Hansot",
        "Jambusar",
        "Netrang",
        "Vagra",
        "Valia",
        "Zagadia",
      ],
      Bhavnagar: [
        "Bhavnagar",
        "Gariadhar",
        "Ghogha",
        "Jesar",
        "Mahuva",
        "Palitana",
        "Sihor",
        "Talaja",
        "Umrala",
        "Vallabhipur",
      ],
      Botad: ["Botad", "Barwala", "Gadhada", "Ranpur"],
      "Chhota Udaipur": [
        "Chhota Udaipur",
        "Bodeli",
        "Jetpur Pavi",
        "Kavant",
        "Nasvadi",
        "Sankheda",
      ],
      Dahod: [
        "Dahod",
        "Devgadh Baria",
        "Dhanpur",
        "Fatepura",
        "Garbada",
        "Limkheda",
        "Sanjeli",
        "Zalod",
      ],
      Dang: ["Ahwa", "Subir", "Waghai"],
      "Devbhoomi Dwarka": [
        "Bhanvad",
        "Kalyanpur",
        "Khambhalia",
        "Okhamandal (Dwarka)",
      ],
      Gandhinagar: ["Gandhinagar", "Dehgam", "Kalol", "Mansa"],
      "Gir Somnath": [
        "Gir Gadhada",
        "Kodinar",
        "Sutrapada",
        "Talala",
        "Una",
        "Veraval (Patan-Veraval)",
      ],
      Jamnagar: [
        "Jamnagar",
        "Dhrol",
        "Jamjodhpur",
        "Jodiya",
        "Kalavad",
        "Lalpur",
      ],
      Junagadh: [
        "Junagadh City",
        "Junagadh Rural",
        "Bhesan",
        "Keshod",
        "Malia Hatina",
        "Manavadar",
        "Mangrol",
        "Mendarda",
        "Vanthali",
        "Visavadar",
      ],
      Kheda: [
        "Kheda",
        "Nadiad",
        "Balasinor",
        "Dakhor",
        "Galteshwar",
        "Kapadvanj",
        "Kathlal",
        "Mahudha",
        "Matar",
        "Mehmedabad",
        "Thasra",
        "Vaso",
      ],
      Kutch: [
        "Bhuj",
        "Abdasa",
        "Anjar",
        "Bhachau",
        "Gandhidham",
        "Lakhpat",
        "Mandvi",
        "Mundra",
        "Nakhatrana",
        "Rapar",
      ],
      Mahisagar: [
        "Lunawada",
        "Balasinor",
        "Kadana",
        "Khanpur",
        "Santrampur",
        "Virpur",
      ],
      Mehsana: [
        "Mehsana",
        "Becharaji",
        "Jotana",
        "Kadi",
        "Kheralu",
        "Satlasana",
        "Unjha",
        "Vadnagar",
        "Vijapur",
        "Visnagar",
      ],
      Morbi: ["Morbi", "Halvad", "Maliya", "Tankara", "Wankaner"],
      Narmada: [
        "Rajpipla (Nandod)",
        "Dediapada",
        "Garudeshwar",
        "Sagbara",
        "Tilakwada",
      ],
      Navsari: [
        "Navsari",
        "Chikhli",
        "Gandevi",
        "Jalalpore",
        "Khergam",
        "Vansda",
      ],
      Panchmahal: [
        "Godhra",
        "Ghoghamba",
        "Halol",
        "Jambughoda",
        "Kalol",
        "Morwa Hadaf",
        "Shehera",
      ],
      Patan: [
        "Patan",
        "Chanasma",
        "Harij",
        "Radhanpur",
        "Sami",
        "Santalpur",
        "Sarasvati",
        "Sidhpur",
      ],
      Porbandar: ["Porbandar", "Kutiyana", "Ranavav"],
      Rajkot: [
        "Rajkot",
        "Dhoraji",
        "Gondal",
        "Jam Kandorna",
        "Jasdan",
        "Jetpur",
        "Kotada Sangani",
        "Lodhika",
        "Padadhari",
        "Upleta",
        "Vinchhiya",
      ],
      Sabarkantha: [
        "Himmatnagar",
        "Idar",
        "Khedbrahma",
        "Poshina",
        "Prantij",
        "Talod",
        "Vadali",
        "Vijaynagar",
      ],
      Surat: [
        "Surat City",
        "Bardoli",
        "Choryasi",
        "Kamrej",
        "Mahuva",
        "Mandvi",
        "Mangrol",
        "Olpad",
        "Palsana",
        "Umarpada",
      ],
      Surendranagar: [
        "Surendranagar (Wadhwan)",
        "Chotila",
        "Chuda",
        "Dasada",
        "Dhrangadhra",
        "Lakhtar",
        "Limbdi",
        "Muli",
        "Sayla",
        "Thangadh",
      ],
      Tapi: ["Vyara", "Nizar", "Songadh", "Uchchhal", "Valod", "Kukarmunda"],
      Vadodara: [
        "Vadodara",
        "Dabhoi",
        "Desar",
        "Karjan",
        "Padra",
        "Savli",
        "Sinor",
        "Waghodia",
      ],
      Valsad: ["Valsad", "Dharampur", "Kaprada", "Pardi", "Umbergaon", "Vapi"],
    },
    Maharashtra: {
      Mumbai: ["Mumbai City", "Andheri", "Borivali", "Bandra", "Kurla"],
      Pune: ["Pune City", "Haveli", "Khed", "Baramati", "Shirur", "Indapur"],
    },
    Delhi: {
      "New Delhi": ["Connaught Place", "Chanakyapuri", "Vasant Vihar"],
      "South Delhi": ["Hauz Khas", "Saket", "Kalkaji"],
    },
  },
  USA: {
    California: {
      "Los Angeles County": ["Los Angeles", "Long Beach", "Glendale"],
      "Santa Clara County": ["San Jose", "Palo Alto", "Sunnyvale"],
    },
    "New York": {
      "New York County": ["Manhattan"],
      "Kings County": ["Brooklyn"],
    },
  },
};

export default function CartPage() {
  const { settings } = useSettings();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [step, setStep] = useState<
    "cart" | "shipping" | "payment" | "confirmation"
  >("cart");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>("");

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    country: "", // initialize empty for default select state
    state: "",
    district: "",
    city: "",
    zip: "",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost =
    shippingMethod === "express" ? 250 : subtotal > 2000 ? 0 : 150;
  const total = subtotal + shippingCost;

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    const item = cartItems.find((i) => {
      const id = i.cartItemId || `${i.id}-${i.size}-${i.color}`;
      return id === cartItemId;
    });
    if (item) updateQuantity(cartItemId, item.quantity + delta);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Cascading reset logic for dropdowns
    if (name === "country") {
      setShippingInfo({
        ...shippingInfo,
        country: value,
        state: "",
        district: "",
        city: "",
      });
    } else if (name === "state") {
      setShippingInfo({
        ...shippingInfo,
        state: value,
        district: "",
        city: "",
      });
    } else if (name === "district") {
      setShippingInfo({ ...shippingInfo, district: value, city: "" });
    } else {
      setShippingInfo({ ...shippingInfo, [name]: value });
    }
  };

  // Derive dropdown options dynamically
  const availableCountries = Object.keys(GEO_DATA);
  const availableStates =
    shippingInfo.country && GEO_DATA[shippingInfo.country]
      ? Object.keys(GEO_DATA[shippingInfo.country])
      : [];
  const availableDistricts =
    shippingInfo.country &&
    shippingInfo.state &&
    GEO_DATA[shippingInfo.country][shippingInfo.state]
      ? Object.keys(GEO_DATA[shippingInfo.country][shippingInfo.state])
      : [];
  const availableCities =
    shippingInfo.country &&
    shippingInfo.state &&
    shippingInfo.district &&
    GEO_DATA[shippingInfo.country][shippingInfo.state][shippingInfo.district]
      ? GEO_DATA[shippingInfo.country][shippingInfo.state][
          shippingInfo.district
        ]
      : [];

  const isGeodataAvailable =
    shippingInfo.country && GEO_DATA[shippingInfo.country];

  if (step === "confirmation") {
    return (
      <AuthGuard>
        <main className="min-h-screen bg-background">
          <Header />
          <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Check className="w-10 h-10 text-accent" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your order. We've received it and will begin
                crafting your wooden map soon.
              </p>
              <div className="bg-secondary rounded-lg p-6 mb-8 text-left">
                <p className="text-sm text-muted-foreground mb-2">
                  Order Number
                </p>
                <p className="font-mono text-lg text-foreground font-bold mb-4">
                  #{confirmedOrderNumber}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Estimated Delivery
                </p>
                <p className="text-foreground">
                  {shippingMethod === "express"
                    ? "3-5 business days"
                    : "7-14 business days"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-[#8b5a3c] hover:bg-[#6d4830]">
                  <Link href="/order-status">Track My Order</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-background">
        <Header />

        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground text-center mb-8">
              {step === "cart"
                ? "Your Cart"
                : step === "shipping"
                  ? "Shipping"
                  : "Payment"}
            </h1>
            <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
              {["cart", "shipping", "payment"].map((s, index) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === s ||
                      (step === "shipping" && s === "cart") ||
                      (step === "payment" && s !== "payment")
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 2 && (
                    <div
                      className={`w-16 h-0.5 mx-2 ${
                        (step === "shipping" && s === "cart") ||
                        (step === "payment" && s !== "payment")
                          ? "bg-accent"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {cartItems.length === 0 && step === "cart" ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="font-serif text-2xl text-foreground mb-4">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-8">
                  Looks like you haven't added any maps yet.
                </p>
                <Button asChild>
                  <Link href="/shop">Browse Maps</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  {/* STEP: CART */}
                  {step === "cart" && (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <Card
                          key={item.cartItemId || item.id}
                          className="border-border"
                        >
                          <CardContent className="p-6">
                            <div className="flex gap-6">
                              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted shrink-0">
                                {item.image &&
                                item.image !== "/placeholder.svg" ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-[#f3ebe2] text-[#8b5a3c] text-sm">
                                    No Image
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-medium text-foreground">
                                      {item.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {item.size}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removeFromCart(
                                        item.cartItemId ||
                                          `${item.id}-${item.size}-${item.color}`,
                                      )
                                    }
                                    className="text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 bg-transparent"
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.cartItemId ||
                                            `${item.id}-${item.size}-${item.color}`,
                                          -1,
                                        )
                                      }
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-8 text-center font-medium text-foreground">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 bg-transparent"
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.cartItemId ||
                                            `${item.id}-${item.size}-${item.color}`,
                                          1,
                                        )
                                      }
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <p className="font-semibold text-foreground">
                                    {formatPrice(
                                      item.price * item.quantity,
                                      settings.currency,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* STEP: SHIPPING */}
                  {step === "shipping" && (
                    <Card className="border-border">
                      <CardContent className="p-6">
                        <h2 className="font-serif text-xl font-medium text-foreground mb-6">
                          Shipping Address
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={shippingInfo.firstName}
                              onChange={handleInputChange}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={shippingInfo.lastName}
                              onChange={handleInputChange}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={shippingInfo.email}
                              onChange={handleInputChange}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={shippingInfo.phone}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label htmlFor="address">Address *</Label>
                            <Input
                              id="address"
                              name="address"
                              value={shippingInfo.address}
                              onChange={handleInputChange}
                              className="mt-1"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="zip">PIN Code *</Label>
                            <Input
                              id="zip"
                              name="zip"
                              value={shippingInfo.zip}
                              onChange={handleInputChange}
                              className="mt-1"
                              required
                            />
                          </div>

                          {/* Country Dropdown */}
                          <div>
                            <Label htmlFor="country">Country *</Label>
                            <select
                              id="country"
                              name="country"
                              value={shippingInfo.country}
                              onChange={handleInputChange}
                              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                              required
                            >
                              <option value="" disabled>
                                Select Country
                              </option>
                              {availableCountries.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          {/* State Dropdown/Input */}
                          <div>
                            <Label htmlFor="state">State *</Label>
                            {isGeodataAvailable ? (
                              <select
                                id="state"
                                name="state"
                                value={shippingInfo.state}
                                onChange={handleInputChange}
                                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                disabled={!shippingInfo.country}
                              >
                                <option value="" disabled>
                                  Select State
                                </option>
                                {availableStates.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <Input
                                id="state"
                                name="state"
                                value={shippingInfo.state}
                                onChange={handleInputChange}
                                className="mt-1"
                                required
                              />
                            )}
                          </div>

                          {/* District Dropdown (only rendered if country is selected in GEO_DATA) */}
                          {isGeodataAvailable && (
                            <div>
                              <Label htmlFor="district">District *</Label>
                              <select
                                id="district"
                                name="district"
                                value={shippingInfo.district}
                                onChange={handleInputChange}
                                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                disabled={!shippingInfo.state}
                              >
                                <option value="" disabled>
                                  Select District
                                </option>
                                {availableDistricts.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* City Dropdown/Input */}
                          <div>
                            <Label htmlFor="city">City *</Label>
                            {isGeodataAvailable ? (
                              <select
                                id="city"
                                name="city"
                                value={shippingInfo.city}
                                onChange={handleInputChange}
                                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                disabled={!shippingInfo.district}
                              >
                                <option value="" disabled>
                                  Select City
                                </option>
                                {availableCities.map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <Input
                                id="city"
                                name="city"
                                value={shippingInfo.city}
                                onChange={handleInputChange}
                                className="mt-1"
                                required
                              />
                            )}
                          </div>
                        </div>

                        <div className="mt-8">
                          <h3 className="font-medium text-foreground mb-4">
                            Shipping Method
                          </h3>
                          <RadioGroup
                            value={shippingMethod}
                            onValueChange={setShippingMethod}
                            className="space-y-3"
                          >
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:border-muted-foreground">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem
                                  value="standard"
                                  id="standard"
                                />
                                <Label
                                  htmlFor="standard"
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium text-foreground">
                                      Standard Shipping
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    7-14 business days
                                  </p>
                                </Label>
                              </div>
                              <span className="font-medium text-foreground">
                                {subtotal > 2000
                                  ? "Free"
                                  : formatPrice(150, settings.currency)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:border-muted-foreground">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="express" id="express" />
                                <Label
                                  htmlFor="express"
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-accent" />
                                    <span className="font-medium text-foreground">
                                      Express Shipping
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    3-5 business days
                                  </p>
                                </Label>
                              </div>
                              <span className="font-medium text-foreground">
                                {formatPrice(250, settings.currency)}
                              </span>
                            </div>
                          </RadioGroup>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* STEP: PAYMENT */}
                  {step === "payment" && (
                    <Card className="border-border">
                      <CardContent className="p-6">
                        <h2 className="font-serif text-xl font-medium text-foreground mb-6">
                          Payment
                        </h2>

                        <div className="mb-6 p-4 bg-secondary rounded-lg">
                          <h3 className="font-medium text-foreground mb-2">
                            Shipping to
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {shippingInfo.firstName} {shippingInfo.lastName}
                            <br />
                            {shippingInfo.address}
                            <br />
                            {shippingInfo.city}
                            {shippingInfo.district &&
                              ` (${shippingInfo.district} District)`}
                            {shippingInfo.state
                              ? `, ${shippingInfo.state}`
                              : ""}{" "}
                            {shippingInfo.zip}
                            <br />
                            {shippingInfo.country}
                          </p>
                        </div>

                        {orderError && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {orderError}
                          </div>
                        )}

                        <RazorpayCheckout
                          orderTotal={total}
                          orderId={`order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}
                          customerName={`${shippingInfo.firstName} ${shippingInfo.lastName}`}
                          customerEmail={shippingInfo.email}
                          customerPhone={shippingInfo.phone}
                          onPaymentSuccess={async (paymentId) => {
                            try {
                              setPlacingOrder(true);
                              const supabase = createClient();
                              const {
                                data: { session },
                              } = await supabase.auth.getSession();

                              if (!session?.user?.id) {
                                throw new Error(
                                  "You must be logged in to place an order.",
                                );
                              }

                              const combinedCity = shippingInfo.district
                                ? `${shippingInfo.city} (${shippingInfo.district} District)`
                                : shippingInfo.city;

                              const res = await fetch("/api/orders", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  user_id: session.user.id,
                                  total_amount: total,
                                  shipping_address: shippingInfo.address,
                                  shipping_city: combinedCity,
                                  shipping_state: shippingInfo.state || "",
                                  shipping_zip: shippingInfo.zip || "",
                                  shipping_country:
                                    shippingInfo.country || "India",
                                  contact_email:
                                    shippingInfo.email ||
                                    session.user.email ||
                                    "",
                                  contact_phone: shippingInfo.phone || "",
                                  payment_id: paymentId,
                                  payment_method: "razorpay",
                                  status: "paid",
                                  items: cartItems
                                    .map((item) => ({
                                      product_id: item.id.startsWith("custom-")
                                        ? null
                                        : item.id,
                                      quantity: item.quantity,
                                      price: item.price,
                                      size: item.size || "",
                                      color: item.color || "",
                                    }))
                                    .filter((item) => item.product_id),
                                }),
                              });

                              if (!res.ok) {
                                const err = await res.json();
                                throw new Error(err.error || "Order failed");
                              }

                              const order = await res.json();
                              setConfirmedOrderNumber(
                                order.id?.slice(0, 8) || "CONFIRMED",
                              );
                              clearCart();
                              setPlacingOrder(false);
                              setStep("confirmation");
                            } catch (err) {
                              setOrderError(
                                err instanceof Error
                                  ? err.message
                                  : "Failed to complete order",
                              );
                              setPlacingOrder(false);
                            }
                          }}
                          onPaymentError={(error) => {
                            setOrderError(`Payment failed: ${error}`);
                          }}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* ORDER SUMMARY SIDEBAR */}
                <div>
                  <Card className="border-border sticky top-24">
                    <CardContent className="p-6">
                      <h2 className="font-serif text-xl font-medium text-foreground mb-6">
                        Order Summary
                      </h2>
                      <div className="space-y-4 text-sm">
                        {cartItems.map((item) => (
                          <div
                            key={item.cartItemId || item.id}
                            className="flex justify-between"
                          >
                            <span className="text-muted-foreground">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="text-foreground">
                              {formatPrice(
                                item.price * item.quantity,
                                settings.currency,
                              )}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-border pt-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Subtotal
                            </span>
                            <span className="text-foreground">
                              {formatPrice(subtotal, settings.currency)}
                            </span>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-muted-foreground">
                              Shipping
                            </span>
                            <span className="text-foreground">
                              {shippingCost === 0
                                ? "Free"
                                : formatPrice(shippingCost, settings.currency)}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-border pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-foreground">
                              Total
                            </span>
                            <span className="text-2xl font-semibold text-foreground">
                              {formatPrice(total, settings.currency)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {step === "cart" && (
                        <Button
                          className="w-full mt-6 bg-[#8b5a3c] hover:bg-[#6d4830]"
                          size="lg"
                          onClick={() => setStep("shipping")}
                        >
                          Proceed to Checkout{" "}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}

                      {step === "shipping" && (
                        <div className="space-y-3 mt-6">
                          <Button
                            className="w-full bg-[#8b5a3c] hover:bg-[#6d4830]"
                            size="lg"
                            onClick={() => {
                              if (
                                !shippingInfo.firstName ||
                                !shippingInfo.address ||
                                !shippingInfo.city ||
                                !shippingInfo.country ||
                                !shippingInfo.state ||
                                !shippingInfo.email
                              ) {
                                alert("Please fill in all required fields.");
                                return;
                              }
                              setStep("payment");
                            }}
                          >
                            Continue to Payment{" "}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => setStep("cart")}
                          >
                            Back to Cart
                          </Button>
                        </div>
                      )}

                      {step === "payment" && (
                        <div className="space-y-3 mt-6">
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => setStep("shipping")}
                          >
                            Back to Shipping
                          </Button>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground text-center mt-4">
                        Secure checkout · Orders saved to your account
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </AuthGuard>
  );
}
