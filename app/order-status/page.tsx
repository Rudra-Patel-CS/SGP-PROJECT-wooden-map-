"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AuthGuard } from "@/components/auth-guard";
import {
    Search,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    MapPin,
    Calendar,
    ArrowRight,
    PackageCheck,
    Box,
    ShoppingBag,
} from "lucide-react";

// Demo orders — will be replaced with real data from the database
const demoOrders = [
    {
        id: "WM-20260215-001",
        date: "February 15, 2026",
        items: [
            { name: "Classic World Map", size: "Large (90x60 cm)", qty: 1, price: 399 },
        ],
        total: 399,
        status: "delivered",
        steps: [
            { label: "Order Placed", date: "Feb 15, 2026", time: "3:24 PM", done: true },
            { label: "Confirmed", date: "Feb 15, 2026", time: "3:30 PM", done: true },
            { label: "Crafting", date: "Feb 17, 2026", time: "9:00 AM", done: true },
            { label: "Shipped", date: "Feb 22, 2026", time: "11:45 AM", done: true },
            { label: "Delivered", date: "Feb 26, 2026", time: "2:15 PM", done: true },
        ],
        tracking: "IND2345678901",
        address: "42 MG Road, Ahmedabad, Gujarat 380001",
    },
    {
        id: "WM-20260228-002",
        date: "February 28, 2026",
        items: [
            { name: "LED Europe Map", size: "Medium (60x40 cm)", qty: 1, price: 349 },
            { name: "Minimalist Japan Map", size: "Small (30x20 cm)", qty: 2, price: 199 },
        ],
        total: 747,
        status: "shipped",
        steps: [
            { label: "Order Placed", date: "Feb 28, 2026", time: "10:12 AM", done: true },
            { label: "Confirmed", date: "Feb 28, 2026", time: "10:20 AM", done: true },
            { label: "Crafting", date: "Mar 01, 2026", time: "8:30 AM", done: true },
            { label: "Shipped", date: "Mar 01, 2026", time: "4:00 PM", done: true },
            { label: "Delivered", date: "", time: "", done: false },
        ],
        tracking: "IND9876543210",
        address: "15 SG Highway, Surat, Gujarat 395007",
    },
    {
        id: "WM-20260301-003",
        date: "March 1, 2026",
        items: [
            { name: "Vintage USA Map", size: "Extra Large (120x80 cm)", qty: 1, price: 549 },
        ],
        total: 549,
        status: "crafting",
        steps: [
            { label: "Order Placed", date: "Mar 01, 2026", time: "6:45 PM", done: true },
            { label: "Confirmed", date: "Mar 01, 2026", time: "6:50 PM", done: true },
            { label: "Crafting", date: "Mar 02, 2026", time: "", done: true },
            { label: "Shipped", date: "", time: "", done: false },
            { label: "Delivered", date: "", time: "", done: false },
        ],
        tracking: "",
        address: "7 University Road, Rajkot, Gujarat 360005",
    },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    placed: { label: "Order Placed", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: ShoppingBag },
    confirmed: { label: "Confirmed", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: PackageCheck },
    crafting: { label: "Being Crafted", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Box },
    shipped: { label: "Shipped", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: Truck },
    delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
};

export default function OrderStatusPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<typeof demoOrders[0] | null>(null);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchPerformed(true);
        const found = demoOrders.find(
            (o) => o.id.toLowerCase() === searchQuery.trim().toLowerCase()
        );
        setSelectedOrder(found || null);
    };

    const StatusIcon = selectedOrder ? statusConfig[selectedOrder.status]?.icon || Package : Package;

    return (
        <AuthGuard>
            <>
                <Header />
                <main className="min-h-screen bg-[#fffaf3] pt-24 pb-16">
                    <div className="max-w-4xl mx-auto px-6">

                        {/* Page Title */}
                        <div className="text-center mb-10">
                            <h1 className="font-serif text-4xl text-[#2b1a12] mb-3">
                                Order Status
                            </h1>
                            <p className="text-[#5a3726]/70 max-w-lg mx-auto">
                                Track your handcrafted wooden map order from our workshop to your doorstep.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <Card className="mb-8 border-[#e6dcd0] bg-[#f7f1e8] shadow-sm">
                            <CardContent className="p-6">
                                <form onSubmit={handleSearch} className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b7b65]" />
                                        <Input
                                            placeholder="Enter your Order ID (e.g. WM-20260215-001)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 bg-white border-[#e2d6c6] h-12 text-sm"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="h-12 px-6 bg-[#5a3726] hover:bg-[#3a2418] text-white"
                                    >
                                        Track Order
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Search Result */}
                        {searchPerformed && !selectedOrder && (
                            <div className="text-center py-16">
                                <div className="h-16 w-16 rounded-full bg-[#f3ebe2] flex items-center justify-center mx-auto mb-4">
                                    <Package className="h-8 w-8 text-[#9b7b65]" />
                                </div>
                                <h2 className="font-serif text-xl text-[#2b1a12] mb-2">
                                    No order found
                                </h2>
                                <p className="text-[#5a3726]/70 text-sm mb-6">
                                    We couldn't find an order with that ID. Please check and try again.
                                </p>
                                <Link href="/shop">
                                    <Button className="bg-[#5a3726] hover:bg-[#3a2418] text-white gap-2">
                                        <ShoppingBag className="h-4 w-4" />
                                        Start Shopping
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Order Detail */}
                        {selectedOrder && (
                            <div className="space-y-6">

                                {/* Status Badge + Order Info */}
                                <Card className="border-[#e6dcd0] bg-[#f7f1e8] shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#4a2c14] via-[#6d4830] to-[#8b5a3c] px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Order ID</p>
                                                <h2 className="text-white font-mono text-lg font-semibold">{selectedOrder.id}</h2>
                                            </div>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig[selectedOrder.status]?.bg}`}>
                                                <StatusIcon className={`h-4 w-4 ${statusConfig[selectedOrder.status]?.color}`} />
                                                <span className={`text-sm font-medium ${statusConfig[selectedOrder.status]?.color}`}>
                                                    {statusConfig[selectedOrder.status]?.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-[#f3ebe2] flex items-center justify-center shrink-0">
                                                    <Calendar className="h-4 w-4 text-[#8b5a3c]" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Ordered</p>
                                                    <p className="text-sm font-medium text-[#2b1a12]">{selectedOrder.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-[#f3ebe2] flex items-center justify-center shrink-0">
                                                    <Package className="h-4 w-4 text-[#8b5a3c]" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Items</p>
                                                    <p className="text-sm font-medium text-[#2b1a12]">{selectedOrder.items.length} item{selectedOrder.items.length > 1 ? "s" : ""}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-[#f3ebe2] flex items-center justify-center shrink-0">
                                                    <MapPin className="h-4 w-4 text-[#8b5a3c]" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Ship To</p>
                                                    <p className="text-sm font-medium text-[#2b1a12] truncate max-w-[140px]">{selectedOrder.address.split(",")[0]}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-[#f3ebe2] flex items-center justify-center shrink-0">
                                                    <CreditCard className="h-4 w-4 text-[#8b5a3c]" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Total</p>
                                                    <p className="text-sm font-semibold text-[#2b1a12]">${selectedOrder.total}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Tracking Timeline */}
                                <Card className="border-[#e6dcd0] bg-[#f7f1e8] shadow-sm">
                                    <CardContent className="p-6">
                                        <h3 className="font-serif text-lg text-[#2b1a12] mb-6">Tracking Timeline</h3>

                                        <div className="space-y-0">
                                            {selectedOrder.steps.map((step, i) => {
                                                const isLast = i === selectedOrder.steps.length - 1;
                                                const stepIcons = [ShoppingBag, PackageCheck, Box, Truck, CheckCircle2];
                                                const StepIcon = stepIcons[i] || Package;

                                                return (
                                                    <div key={i} className="flex gap-4">
                                                        {/* Timeline line + dot */}
                                                        <div className="flex flex-col items-center">
                                                            <div
                                                                className={`
                                  w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                  ${step.done
                                                                        ? "bg-[#5a3726] text-white shadow-md shadow-[#5a3726]/20"
                                                                        : "bg-[#e6dcd0] text-[#9b7b65]"
                                                                    }
                                  transition-all duration-300
                                `}
                                                            >
                                                                <StepIcon className="h-4.5 w-4.5" />
                                                            </div>
                                                            {!isLast && (
                                                                <div
                                                                    className={`w-0.5 h-12 ${step.done ? "bg-[#5a3726]" : "bg-[#e6dcd0]"}`}
                                                                />
                                                            )}
                                                        </div>

                                                        {/* Step info */}
                                                        <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                                                            <p className={`text-sm font-medium ${step.done ? "text-[#2b1a12]" : "text-[#9b7b65]"}`}>
                                                                {step.label}
                                                            </p>
                                                            {step.date && (
                                                                <p className="text-xs text-[#9b7b65] mt-0.5">
                                                                    {step.date}{step.time ? ` at ${step.time}` : ""}
                                                                </p>
                                                            )}
                                                            {!step.done && !step.date && (
                                                                <p className="text-xs text-[#9b7b65]/50 mt-0.5 flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" /> Pending
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Tracking number */}
                                        {selectedOrder.tracking && (
                                            <div className="mt-6 pt-5 border-t border-[#e6dcd0]">
                                                <div className="flex items-center justify-between bg-[#fffaf3] rounded-xl p-4 border border-[#e6dcd0]">
                                                    <div>
                                                        <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Tracking Number</p>
                                                        <p className="text-sm font-mono font-semibold text-[#2b1a12]">{selectedOrder.tracking}</p>
                                                    </div>
                                                    <Truck className="h-5 w-5 text-[#8b5a3c]" />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Order Items */}
                                <Card className="border-[#e6dcd0] bg-[#f7f1e8] shadow-sm">
                                    <CardContent className="p-6">
                                        <h3 className="font-serif text-lg text-[#2b1a12] mb-4">Order Items</h3>
                                        <div className="divide-y divide-[#e6dcd0]">
                                            {selectedOrder.items.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                                    <div>
                                                        <p className="text-sm font-medium text-[#2b1a12]">{item.name}</p>
                                                        <p className="text-xs text-[#9b7b65]">{item.size} · Qty: {item.qty}</p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-[#2b1a12]">${item.price}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-[#e6dcd0] flex items-center justify-between">
                                            <p className="text-sm font-medium text-[#5a3726]">Order Total</p>
                                            <p className="text-lg font-serif font-semibold text-[#2b1a12]">${selectedOrder.total}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* All Orders (shown before search) */}
                        {!searchPerformed && (
                            <div>
                                <h2 className="font-serif text-2xl text-[#2b1a12] mb-6">Your Recent Orders</h2>
                                <div className="space-y-4">
                                    {demoOrders.map((order) => {
                                        const cfg = statusConfig[order.status];
                                        const Icon = cfg?.icon || Package;
                                        return (
                                            <Card
                                                key={order.id}
                                                className="border-[#e6dcd0] bg-[#f7f1e8] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setSearchQuery(order.id);
                                                    setSearchPerformed(true);
                                                }}
                                            >
                                                <CardContent className="p-5">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-xl bg-[#f3ebe2] flex items-center justify-center">
                                                                <Icon className={`h-5 w-5 ${cfg?.color}`} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-mono font-semibold text-[#2b1a12]">{order.id}</p>
                                                                <p className="text-xs text-[#9b7b65]">{order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${cfg?.bg}`}>
                                                                <span className={`text-xs font-medium ${cfg?.color}`}>{cfg?.label}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-semibold text-[#2b1a12]">${order.total}</p>
                                                            </div>
                                                            <ArrowRight className="h-4 w-4 text-[#9b7b65]" />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                </main>
                <Footer />
            </>
        </AuthGuard>
    );
}
