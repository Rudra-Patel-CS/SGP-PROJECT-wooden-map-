import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { startOfDay, subDays, format, isWithinInterval, parseISO } from 'date-fns';

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function GET(req: NextRequest) {
    try {
        const adminAuth = req.headers.get("x-admin-auth");
        if (adminAuth !== "true") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        const supabase = getServiceClient();

        // 1. Fetch Orders for various aggregates
        const { data: rawOrders, error: ordersError } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    price,
                    quantity,
                    product_id,
                    products ( name, category, rating )
                )
            `);

        if (ordersError) throw ordersError;

        // 2. Fetch all products for category distribution
        const { data: allProducts, error: productsError } = await supabase
            .from("products")
            .select("category, is_active");
        
        if (productsError) throw productsError;

        // --- FILTERING ---
        let allOrders = rawOrders;
        if (startDateParam && endDateParam) {
            const start = parseISO(startDateParam);
            const end = parseISO(endDateParam);
            allOrders = rawOrders.filter(o => {
                const date = new Date(o.created_at);
                return isWithinInterval(date, { start, end });
            });
        }
        
        const validOrders = allOrders.filter(o => o.status !== 'cancelled');
        
        // --- CALCULATE METRICS ---
        
        const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const totalOrdersCount = allOrders.length;
        const uniqueCustomers = new Set(allOrders.map(o => o.contact_email || o.user_id)).size;
        const productsSoldCount = validOrders.reduce((sum, o) => {
            const itemQty = o.order_items?.reduce((s: number, i: any) => s + (i.quantity || 0), 0) || 0;
            return sum + itemQty;
        }, 0);

        // --- CHART DATA & TRENDS ---

        // Revenue Trend (Last 7 target days or the whole filtered range)
        // For the report, we'll use the last 7 days names
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const trendData = dayNames.map(dayName => {
            const dayOrders = validOrders.filter(o => format(new Date(o.created_at), 'EEE') === dayName);
            const revenue = dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
            return { date: dayName, revenue, orders: dayOrders.length };
        });

        // Peak & Lowest Days
        const sortedTrend = [...trendData].sort((a, b) => b.revenue - a.revenue);
        const peakDay = sortedTrend[0]?.revenue > 0 ? sortedTrend[0].date : "N/A";
        const lowestDay = sortedTrend[sortedTrend.length - 1]?.revenue === 0 
            ? trendData.filter(d => d.revenue === 0).map(d => d.date).join(', ') 
            : sortedTrend[sortedTrend.length - 1].date;

        // --- CATEGORIES ---
        const catMap: Record<string, number> = { 'World Maps': 0, 'Country Maps': 0, 'City Maps': 0 };
        allProducts.forEach(p => {
           if (p.category === 'world') catMap['World Maps']++;
           else if (p.category === 'country') catMap['Country Maps']++;
           else if (p.category === 'city') catMap['City Maps']++;
        });

        // Actual sales breakdown by category
        const salesCatMap: Record<string, number> = { 'world': 0, 'country': 0, 'city': 0 };
        validOrders.forEach(o => {
            o.order_items?.forEach((i: any) => {
                const cat = i.products?.category || 'world';
                salesCatMap[cat] += (i.quantity || 0);
            });
        });
        const totalSales = Object.values(salesCatMap).reduce((a, b) => a + b, 0) || 1;

        const categoryData = [
            { name: 'World Maps', value: Math.round((salesCatMap['world'] / totalSales) * 100), color: '#D6A07A' },
            { name: 'Country Maps', value: Math.round((salesCatMap['country'] / totalSales) * 100), color: '#C78F8A' },
            { name: 'City Maps', value: Math.round((salesCatMap['city'] / totalSales) * 100), color: '#9C6F73' }
        ];

        // --- STATUS ---
        const statusMap: Record<string, number> = { 'Completed': 0, 'Processing': 0, 'Pending': 0, 'Cancelled': 0 };
        allOrders.forEach(o => {
            if (o.status === 'delivered' || o.status === 'shipped') statusMap['Completed']++;
            else if (o.status === 'crafting') statusMap['Processing']++;
            else if (o.status === 'placed') statusMap['Pending']++;
            else if (o.status === 'cancelled') statusMap['Cancelled']++;
        });
        const statusData = [
            { status: 'Completed', count: statusMap['Completed'], fill: '#10b981' },
            { status: 'Processing', count: statusMap['Processing'], fill: '#3b82f6' },
            { status: 'Pending', count: statusMap['Pending'], fill: '#eab308' },
            { status: 'Cancelled', count: statusMap['Cancelled'], fill: '#ef4444' }
        ];

        // --- TOP PRODUCTS ---
        const productStats: Record<string, { name: string, sold: number, revenue: number, rating: number }> = {};
        validOrders.forEach(o => {
            o.order_items?.forEach((item: any) => {
                const pid = item.product_id;
                if (!productStats[pid]) {
                    productStats[pid] = { name: item.products?.name || 'Unknown', sold: 0, revenue: 0, rating: item.products?.rating || 0 };
                }
                productStats[pid].sold += item.quantity || 0;
                productStats[pid].revenue += (item.price || 0) * (item.quantity || 0);
            });
        });

        const topProductsData = Object.values(productStats)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 4)
            .map((p, idx) => ({
                id: idx + 1,
                name: p.name,
                sold: p.sold,
                revenue: `₹${p.revenue.toLocaleString()}`,
                rating: `⭐ ${p.rating || 'N/A'}`
            }));

        // --- AI INSIGHTS ---
        const aiInsights = [];
        if (salesCatMap['city'] === 0) aiInsights.push("🔴 Promote City Maps: Currently contributing 0% to sales. Consider a 'City Spotlight' campaign.");
        if (peakDay !== "N/A") aiInsights.push(`📈 Weekend Prep: ${peakDay} is your strongest sales day. Increase marketing efforts 24 hours prior.`);
        if (statusMap['Pending'] > statusMap['Completed']) aiInsights.push("⚡ Speed Alert: Pending orders exceed completed ones. Review 'Crafting' bottleneck.");
        if (uniqueCustomers < totalOrdersCount * 0.8) aiInsights.push("🎉 High Loyalty: You have a significant number of repeat customers. Start a loyalty rewards program.");
        if (aiInsights.length < 2) aiInsights.push("✨ Stable Growth: Continue maintaining current quality standards to ensure long-term trust.");

        return NextResponse.json({
            metrics: {
                totalRevenue: `₹${totalRevenue.toLocaleString()}`,
                totalOrders: totalOrdersCount.toLocaleString(),
                totalCustomers: uniqueCustomers.toLocaleString(),
                productsSold: productsSoldCount.toLocaleString(),
            },
            analysis: {
                peakDay,
                lowestDay,
                bestProduct: topProductsData[0]?.name || "N/A",
                aiInsights
            },
            charts: {
                revenueTrend: trendData,
                categoryDistribution: categoryData,
                statusDistribution: statusData,
                topProducts: topProductsData
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 });
    }
}
