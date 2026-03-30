"use client";

// TODO: Integrate with payment gateway (Stripe/PayPal)
// TODO: Add order confirmation emails
// TODO: Connect to backend API for order processing
// TODO: Add order tracking functionality
// TODO: Implement shipping calculator based on location
// TODO: Add discount code functionality

import React from "react"

import { useState } from "react";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard, Check, Truck } from "lucide-react";
import { useCart } from "@/lib_supabase/cart-context";
import { AuthGuard } from "@/components/auth-guard";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartCount } = useCart();
  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "confirmation">("cart");
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === "express" ? 25 : subtotal > 200 ? 0 : 15;
  const total = subtotal + shippingCost;

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    const item = cartItems.find((i) => {
      const itemCartId = i.cartItemId || `${i.id}-${i.size}-${i.color}`;
      return itemCartId === cartItemId;
    });
    if (item) {
      updateQuantity(cartItemId, item.quantity + delta);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

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
                Thank you for your order. We've sent a confirmation email to {shippingInfo.email || "your email"}.
                Your handcrafted wooden maps will be carefully prepared and shipped soon.
              </p>
              <div className="bg-secondary rounded-lg p-6 mb-8 text-left">
                <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                <p className="font-mono text-lg text-foreground mb-4">#WM-{Date.now().toString().slice(-8)}</p>
                <p className="text-sm text-muted-foreground mb-2">Estimated Delivery</p>
                <p className="text-foreground">
                  {shippingMethod === "express" ? "3-5 business days" : "7-14 business days"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Return Home</Link>
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
              {step === "cart" ? "Your Cart" : step === "shipping" ? "Shipping" : "Payment"}
            </h1>

            <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
              {["cart", "shipping", "payment"].map((s, index) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === s || (step === "shipping" && s === "cart") || (step === "payment" && s !== "payment")
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {index + 1}
                  </div>
                  {index < 2 && (
                    <div className={`w-16 h-0.5 mx-2 ${(step === "shipping" && s === "cart") || (step === "payment" && s !== "payment")
                      ? "bg-accent"
                      : "bg-muted"
                      }`} />
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
                <h2 className="font-serif text-2xl text-foreground mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8">Looks like you haven't added any maps yet.</p>
                <Button asChild>
                  <Link href="/shop">Browse Maps</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  {step === "cart" && (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <Card key={item.id} className="border-border">
                          <CardContent className="p-6">
                            <div className="flex gap-6">
                              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted shrink-0">
                                {item.image && item.image !== "/placeholder.svg" ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-[#f3ebe2] text-[#8b5a3c] text-sm">No Image</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-medium text-foreground">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">{item.size}</p>
                                    <p className="text-sm text-muted-foreground">{item.color}</p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const cartItemId = item.cartItemId || `${item.id}-${item.size}-${item.color}`;
                                      removeFromCart(cartItemId);
                                    }}
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
                                      onClick={() => {
                                        const cartItemId = item.cartItemId || `${item.id}-${item.size}-${item.color}`;
                                        handleUpdateQuantity(cartItemId, -1);
                                      }}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 bg-transparent"
                                      onClick={() => {
                                        const cartItemId = item.cartItemId || `${item.id}-${item.size}-${item.color}`;
                                        handleUpdateQuantity(cartItemId, 1);
                                      }}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <p className="font-semibold text-foreground">${item.price * item.quantity}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {step === "shipping" && (
                    <Card className="border-border">
                      <CardContent className="p-6">
                        <h2 className="font-serif text-xl font-medium text-foreground mb-6">Shipping Address</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={shippingInfo.firstName}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={shippingInfo.lastName}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label htmlFor="email" className="text-foreground">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={shippingInfo.email}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label htmlFor="phone" className="text-foreground">Phone</Label>
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
                            <Label htmlFor="address" className="text-foreground">Address</Label>
                            <Input
                              id="address"
                              name="address"
                              value={shippingInfo.address}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="city" className="text-foreground">City</Label>
                            <Input
                              id="city"
                              name="city"
                              value={shippingInfo.city}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state" className="text-foreground">State</Label>
                            <Input
                              id="state"
                              name="state"
                              value={shippingInfo.state}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="zip" className="text-foreground">ZIP Code</Label>
                            <Input
                              id="zip"
                              name="zip"
                              value={shippingInfo.zip}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="country" className="text-foreground">Country</Label>
                            <Input
                              id="country"
                              name="country"
                              value={shippingInfo.country}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div className="mt-8">
                          <h3 className="font-medium text-foreground mb-4">Shipping Method</h3>
                          <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:border-muted-foreground">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="standard" id="standard" />
                                <Label htmlFor="standard" className="cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium text-foreground">Standard Shipping</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">7-14 business days</p>
                                </Label>
                              </div>
                              <span className="font-medium text-foreground">{subtotal > 2000 ? "Free" : "₹150"}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:border-muted-foreground">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="express" id="express" />
                                <Label htmlFor="express" className="cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-accent" />
                                    <span className="font-medium text-foreground">Express Shipping</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">3-5 business days</p>
                                </Label>
                              </div>
                              <span className="font-medium text-foreground">₹250</span>
                            </div>
                          </RadioGroup>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {step === "payment" && (
                    <Card className="border-border">
                      <CardContent className="p-6">
                        <h2 className="font-serif text-xl font-medium text-foreground mb-6">Payment Details</h2>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardNumber" className="text-foreground">Card Number</Label>
                            <div className="relative mt-1">
                              <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="pl-10" />
                              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry" className="text-foreground">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="cvc" className="text-foreground">CVC</Label>
                              <Input id="cvc" placeholder="123" className="mt-1" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="cardName" className="text-foreground">Name on Card</Label>
                            <Input id="cardName" placeholder="John Doe" className="mt-1" />
                          </div>
                        </div>

                        <div className="mt-8 p-4 bg-secondary rounded-lg">
                          <h3 className="font-medium text-foreground mb-3">Shipping to</h3>
                          <p className="text-sm text-muted-foreground">
                            {shippingInfo.firstName} {shippingInfo.lastName}<br />
                            {shippingInfo.address}<br />
                            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}<br />
                            {shippingInfo.country}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div>
                  <Card className="border-border sticky top-24">
                    <CardContent className="p-6">
                      <h2 className="font-serif text-xl font-medium text-foreground mb-6">Order Summary</h2>
                      <div className="space-y-4 text-sm">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span className="text-muted-foreground">
                              {item.name} x {item.quantity}
                            </span>
                            <span className="text-foreground">${item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="border-t border-border pt-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="text-foreground">${subtotal}</span>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="text-foreground">{shippingCost === 0 ? "Free" : `$${shippingCost}`}</span>
                          </div>
                        </div>
                        <div className="border-t border-border pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-foreground">Total</span>
                            <span className="text-2xl font-semibold text-foreground">${total}</span>
                          </div>
                        </div>
                      </div>

                      {step === "cart" && (
                        <Button className="w-full mt-6" size="lg" onClick={() => setStep("shipping")}>
                          Proceed to Checkout
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}

                      {step === "shipping" && (
                        <div className="space-y-3 mt-6">
                          <Button className="w-full" size="lg" onClick={() => setStep("payment")}>
                            Continue to Payment
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                          <Button variant="outline" className="w-full bg-transparent" onClick={() => setStep("cart")}>
                            Back to Cart
                          </Button>
                        </div>
                      )}

                      {step === "payment" && (
                        <div className="space-y-3 mt-6">
                          <Button className="w-full" size="lg" onClick={() => setStep("confirmation")}>
                            Place Order - ${total}
                          </Button>
                          <Button variant="outline" className="w-full bg-transparent" onClick={() => setStep("shipping")}>
                            Back to Shipping
                          </Button>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground text-center mt-4">
                        Secure checkout powered by Stripe
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