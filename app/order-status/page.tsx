"use client";

import { useState, useEffect } from "react";
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
    CreditCard,
    Loader2,
    XCircle
} from "lucide-react";
import { createClient } from "@/lib_supabase/supabase/client";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    placed: { label: "Order Placed", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: ShoppingBag },
    confirmed: { label: "Confirmed", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: PackageCheck },
    crafting: { label: "Being Crafted", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Box },
    shipped: { label: "Shipped", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: Truck },
    delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
    cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
};

function determineSteps(status: string, createdAt: string) {
    const baseDate = new Date(createdAt);
    const formatDate = (date: Date) => date.toLocaleDateString();
    
    // We mock timeline offsets strictly for visual demonstration of a timeline relative to createdAt.
    const addDays = (days: number) => { const d = new Date(baseDate); d.setDate(d.getDate() + days); return d; };
    
    return [
        { label: "Order Placed", date: formatDate(baseDate), time: "", done: true },
        { label: "Confirmed", date: status!=='placed'? formatDate(baseDate) : "", time: "", done: status !== "placed" },
        { label: "Crafting", date: ["crafting", "shipped", "delivered"].includes(status) ? formatDate(addDays(2)) : "", time: "", done: ["crafting", "shipped", "delivered"].includes(status) },
        { label: "Shipped", date: ["shipped", "delivered"].includes(status) ? formatDate(addDays(5)) : "", time: "", done: ["shipped", "delivered"].includes(status) },
        { label: "Delivered", date: status === "delivered" ? formatDate(addDays(8)) : "", time: "", done: status === "delivered" },
    ];
}

export default function OrderStatusPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    
    const [myOrders, setMyOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMyOrders() {
            try {
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session?.user) {
                    setLoading(false);
                    return;
                }
                
                const userId = session.user.id;
                const userEmail = session.user.email || '';
                
                const res = await fetch(`/api/orders/my?user_id=${userId}&email=${encodeURIComponent(userEmail)}`);
                if (res.ok) {
                    const data = await res.json();
                    setMyOrders(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchMyOrders();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchPerformed(true);
        const term = searchQuery.trim().toLowerCase();
        const found = myOrders.find((o) => {
            const shortId = o.id.split('-')[0].toLowerCase();
            return o.id.toLowerCase() === term || shortId === term || o.contact_email.toLowerCase() === term;
        });
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
                                            placeholder="Enter your Order ID (or Email)"
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

                        {loading ? (
                            <div className="flex justify-center py-16">
                                <Loader2 className="h-8 w-8 animate-spin text-[#8b5a3c]" />
                            </div>
                        ) : (
                           <>
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
                                        We couldn't find an order with that ID or Email. Please check and try again.
                                    </p>
                                    <Link href="/shop">
                                        <Button className="bg-[#5a3726] hover:bg-[#3a2418] text-white gap-2">
                                            <ShoppingBag className="h-4 w-4" />
                                            Start Shopping
                                        </Button>
                                    </Link>
                                    <div className="mt-4">
                                       <Button variant={"link"} className="text-[#8b5a3c]" onClick={() => { setSearchPerformed(false); setSearchQuery(""); }}>
                                           Show All Orders
                                       </Button>
                                    </div>
                                </div>
                            )}

                            {/* Order Detail */}
                            {selectedOrder && (
                                <div className="space-y-6">
                                    <div className="mb-4">
                                        <Button variant="link" className="px-0 text-[#8b5a3c]" onClick={() => { setSelectedOrder(null); setSearchPerformed(false); setSearchQuery(""); }}>
                                            &larr; Back to all orders
                                        </Button>
                                    </div>
                                    {/* Status Badge + Order Info */}
                                    <Card className="border-[#e6dcd0] bg-[#f7f1e8] shadow-sm overflow-hidden">
                                        <div className="bg-gradient-to-r from-[#4a2c14] via-[#6d4830] to-[#8b5a3c] px-6 py-5">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Order ID</p>
                                                    <h2 className="text-white font-mono text-lg font-semibold text-wrap truncate max-w-[150px] sm:max-w-none">#{selectedOrder.id.split('-')[0].toUpperCase()}</h2>
                                                </div>
                                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig[selectedOrder.status]?.bg || 'bg-gray-50 border-gray-200'}`}>
                                                    <StatusIcon className={`h-4 w-4 ${statusConfig[selectedOrder.status]?.color || 'text-gray-500'}`} />
                                                    <span className={`text-sm font-medium ${statusConfig[selectedOrder.status]?.color || 'text-gray-500'}`}>
                                                        {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
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
                                                        <p className="text-sm font-medium text-[#2b1a12]">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="h-9 w-9 rounded-lg bg-[#f3ebe2] flex items-center justify-center shrink-0">
                                                        <Package className="h-4 w-4 text-[#8b5a3c]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Items</p>
                                                        <p className="text-sm font-medium text-[#2b1a12]">{selectedOrder.order_items?.length || 0} item{(selectedOrder.order_items?.length || 0) > 1 ? "s" : ""}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="h-9 w-9 rounded-lg bg-[#f3ebe2] flex items-center justify-center shrink-0">
                                                        <MapPin className="h-4 w-4 text-[#8b5a3c]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Ship To</p>
                                                        <p className="text-sm font-medium text-[#2b1a12] truncate max-w-[140px]">{selectedOrder.shipping_city}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="h-9 w-9 rounded-lg bg-[#f3ebe2] flex items-center justify-center shrink-0">
                                                        <CreditCard className="h-4 w-4 text-[#8b5a3c]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Total</p>
                                                        <p className="text-sm font-semibold text-[#2b1a12]">₹{selectedOrder.total_amount?.toLocaleString()}</p>
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
                                                {selectedOrder.status === 'cancelled' ? (
                                                    <div className="text-center py-6">
                                                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                                        <p className="text-xl font-bold text-gray-900">Order Cancelled</p>
                                                        <p className="text-sm text-gray-500 mt-2">This order was cancelled and will not be shipped.</p>
                                                    </div>
                                                ) : determineSteps(selectedOrder.status, selectedOrder.created_at).map((step, i, arr) => {
                                                    const isLast = i === arr.length - 1;
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
                                                                        {step.date}
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
                                        </CardContent>
                                    </Card>

                                    {/* Order Items */}
                                    <Card className="border-[#e6dcd0] bg-[#f7f1e8] shadow-sm">
                                        <CardContent className="p-6">
                                            <h3 className="font-serif text-lg text-[#2b1a12] mb-4">Order Items</h3>
                                            <div className="divide-y divide-[#e6dcd0]">
                                                {selectedOrder.order_items?.map((item: any, i: number) => (
                                                    <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                                        <div>
                                                            <p className="text-sm font-medium text-[#2b1a12]">{item.products?.name || 'Custom Map'}</p>
                                                            <p className="text-xs text-[#9b7b65]">{item.size || 'Standard'} · Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-sm font-semibold text-[#2b1a12]">₹{item.price?.toLocaleString()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-[#e6dcd0] flex items-center justify-between">
                                                <p className="text-sm font-medium text-[#5a3726]">Order Total</p>
                                                <p className="text-lg font-serif font-semibold text-[#2b1a12]">₹{selectedOrder.total_amount?.toLocaleString()}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* All Orders (shown before search) */}
                            {!searchPerformed && (
                                <div>
                                    <h2 className="font-serif text-2xl text-[#2b1a12] mb-6">Your Recent Orders</h2>
                                    {myOrders.length === 0 ? (
                                        <div className="text-center py-16 bg-[#f7f1e8] rounded-xl border border-[#e6dcd0]">
                                            <Package className="h-12 w-12 text-[#9b7b65] mx-auto mb-4" />
                                            <h3 className="text-lg font-bold text-[#2b1a12]">No orders yet</h3>
                                            <p className="text-sm text-[#9b7b65] mt-2 mb-6">It looks like you haven't placed any orders.</p>
                                            <Link href="/shop">
                                                <Button className="bg-[#5a3726] hover:bg-[#3a2418] text-white gap-2">
                                                    Start Shopping
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {myOrders.map((order) => {
                                                const cfg = statusConfig[order.status] || statusConfig['placed'];
                                                const Icon = cfg?.icon || Package;
                                                return (
                                                    <Card
                                                        key={order.id}
                                                        className="border-[#e6dcd0] bg-[#f7f1e8] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setSearchQuery(order.id.split('-')[0].toUpperCase());
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
                                                                        <p className="text-sm font-mono font-semibold text-[#2b1a12]">#{order.id.split('-')[0].toUpperCase()}</p>
                                                                        <p className="text-xs text-[#9b7b65]">{new Date(order.created_at).toLocaleDateString()} · {order.order_items?.length || 0} item{(order.order_items?.length || 0) > 1 ? "s" : ""}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${cfg?.bg}`}>
                                                                        <span className={`text-xs font-medium ${cfg?.color}`}>{cfg?.label}</span>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-sm font-semibold text-[#2b1a12]">₹{order.total_amount?.toLocaleString()}</p>
                                                                    </div>
                                                                    <ArrowRight className="h-4 w-4 text-[#9b7b65]" />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                           </>
                        )}

                    </div>
                </main>
                <Footer />
            </>
        </AuthGuard>
    );
}
