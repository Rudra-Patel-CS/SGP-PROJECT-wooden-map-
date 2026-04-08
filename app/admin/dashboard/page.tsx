'use client'

import { useState, useEffect, useCallback } from 'react'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  TrendingUp,
  ShoppingCart, 
  Users, 
  Package,
  DollarSign,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  Zap,
  Loader2,
  RefreshCw,
  FileText,
  ChevronDown
} from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

// Metrics and Charts UI Components
function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'indigo'
}: {
  title: string
  value: string
  change: string
  icon: React.ComponentType<any>
  color?: string
}) {
  const borderColor = color === 'indigo' ? '#D6A07A' : color === 'green' ? '#9C6F73' : color === 'blue' ? '#5A6B7A' : '#C78F8A'
  const iconBg = color === 'indigo' ? 'rgba(214,160,122,0.15)' : color === 'green' ? 'rgba(156,111,115,0.15)' : color === 'blue' ? 'rgba(90,107,122,0.15)' : 'rgba(199,143,138,0.15)'

  return (
    <div
      style={{ background: '#FFFFFF', borderLeft: `4px solid ${borderColor}` }}
      className="rounded-xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5 duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: borderColor }}>{title}</p>
          <p className="text-2xl font-bold" style={{ color: '#1E2430' }}>{value}</p>
          <p className="text-xs mt-2" style={{ color: '#7E4A4A' }}>{change}</p>
        </div>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-inner" style={{ background: iconBg, color: borderColor }}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.15)' }}
      className="rounded-xl transition-all p-6 hover:shadow-sm"
    >
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#1E2430' }}>
        <div className="w-1.5 h-1.5 rounded-full bg-[#8b5a3c]" />
        {title}
      </h3>
      {children}
    </div>
  )
}

function TableCard({ 
  title, 
  columns,
  data
}: { 
  title: string
  columns: string[]
  data: any[]
}) {
  return (
    <div
      style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.15)' }}
      className="rounded-xl p-6 hover:shadow-sm h-full"
    >
      <h3 className="text-lg font-bold mb-4" style={{ color: '#1E2430' }}>{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(139,90,60,0.15)' }}>
              {columns.map((col) => (
                <th key={col} className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: '#8b5a3c' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
                <tr>
                    <td colSpan={columns.length} className="text-center py-8 text-[#6E6B5E]">No data to display.</td>
                </tr>
            ) : data.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(139,90,60,0.1)' }} className="transition-colors hover:bg-[#fdfaf6]">
                {columns.map((col, i) => (
                  <td key={i} className="py-4 px-4 font-medium" style={{ color: '#3b2412' }}>
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [dateFilter, setDateFilter] = useState('week')
  const [loading, setLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [recentDynamicOrders, setRecentDynamicOrders] = useState<any[]>([]);
  
  // Check and Fetch Data
  const fetchDashboardData = useCallback(async () => {
    
    try {
        setLoading(true)
        let startDate = '', endDate = '';
        const today = new Date();
        
        if (dateFilter === 'today') {
            startDate = startOfDay(today).toISOString();
            endDate = endOfDay(today).toISOString();
        } else if (dateFilter === 'week') {
            startDate = subDays(today, 7).toISOString();
            endDate = today.toISOString();
        } else if (dateFilter === 'month') {
            startDate = subDays(today, 30).toISOString();
            endDate = today.toISOString();
        }

        const statsRes = await fetch(`/api/admin/stats?startDate=${startDate}&endDate=${endDate}`, {
            headers: { 'x-admin-auth': 'true' }
        });
        if (statsRes.ok) {
            const data = await statsRes.json();
            setDashboardStats(data);
        }

        const ordersRes = await fetch('/api/orders', {
          headers: { 'x-admin-auth': 'true' }
        });
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          const formatted = data.slice(0, 5).map((o: any) => {
              const name = o.contact_email ? o.contact_email.split('@')[0] : (o.shipping_address?.name || 'Guest');
              const mapTypeName = o.order_items && o.order_items.length > 0
                ? o.order_items[0].products?.name
                : 'Custom Map';
                
              let st = o.status === 'delivered' ? 'Completed' : (o.status === 'crafting' || o.status === 'shipped') ? 'Processing' : o.status === 'cancelled' ? 'Cancelled' : 'Pending';
                
              return {
                 id: o.id.split('-')[0].toUpperCase(),
                 customer: name,
                 amount: `₹${(o.total_amount || 0).toLocaleString()}`,
                 status: st,
                 mapType: mapTypeName
              };
          });
          setRecentDynamicOrders(formatted);
        }
    } catch (err) {
        console.error("Dashboard Fetch Error:", err);
    } finally {
        setLoading(false)
    }
  }, [dateFilter])

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData])

  const handleExportDetailedReport = () => {
    if (!dashboardStats) return;
    const doc = new jsPDF()
    const reportDate = format(new Date(), 'dd MMMM yyyy')
    const { metrics, charts, analysis } = dashboardStats;

    // --- PAGE 1: TITLE PAGE ---
    doc.setFillColor(139, 90, 60); // Wooden Brown
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40)
    doc.text('ARYAM MAPS', 105, 100, { align: 'center' })
    doc.setFontSize(18)
    doc.text('Executive Business Report', 105, 115, { align: 'center' })
    doc.setFontSize(12)
    doc.text('3D Wooden Map E-commerce Analytics', 105, 130, { align: 'center' })
    
    doc.setFontSize(10)
    doc.text(`Generated on: ${reportDate}`, 105, 250, { align: 'center' })

    // --- PAGE 2: EXECUTIVE SUMMARY & METRICS ---
    doc.addPage();
    doc.setTextColor(43, 26, 18);
    doc.setFontSize(22)
    doc.text('1. Executive Summary', 14, 25)
    
    doc.setFontSize(11)
    doc.text('Aryam Maps has shown stable performance during this period with consistent product demand and growing customer engagement. The metrics below summarize the overall business health.', 14, 35, { maxWidth: 180 })

    doc.setFillColor(247, 241, 232)
    doc.roundedRect(14, 50, 182, 40, 3, 3, 'F')
    doc.setFontSize(9)
    doc.setTextColor(90, 55, 38)
    doc.text('CORE PERFORMANCE METRICS', 20, 58)
    
    doc.setFontSize(14)
    doc.setTextColor(43, 26, 18)
    doc.text(`Revenue: ${metrics.totalRevenue}`, 20, 75)
    doc.text(`Orders: ${metrics.totalOrders}`, 70, 75)
    doc.text(`Customers: ${metrics.totalCustomers}`, 110, 75)
    doc.text(`Sold: ${metrics.productsSold}`, 150, 75)

    // Sales Analysis
    doc.setFontSize(18)
    doc.text('2. Sales & Trend Analysis', 14, 110)
    doc.setFontSize(11)
    doc.text(`Analysis reveals that ${analysis.peakDay} was the peak performance period, while the lowest activity was observed on ${analysis.lowestDay}.`, 14, 120, { maxWidth: 180 })
    
    doc.setFontSize(10)
    doc.setTextColor(139, 90, 60)
    doc.text(`Insight: Sales peak observed on ${analysis.peakDay} indicating specific demand patterns.`, 14, 135)

    // --- PAGE 3: PRODUCT & ORDER STATUS ---
    doc.addPage();
    doc.setTextColor(43, 26, 18);
    doc.setFontSize(18)
    doc.text('3. Product Insights', 14, 25)
    doc.setFontSize(12)
    doc.text(`Most Sold Product: ${analysis.bestProduct}`, 14, 35)

    const catData = charts.categoryDistribution.map((c: any) => [c.name, `${c.value}%`]);
    autoTable(doc, { 
      startY: 45, 
      head: [['Product Category', 'Market Contribution']], 
      body: catData,
      theme: 'grid',
      headStyles: { fillColor: [139, 90, 60] }
    });

    doc.setFontSize(18)
    doc.text('4. Order Status Analysis', 14, (doc as any).lastAutoTable.finalY + 20)
    const statusRows = charts.statusDistribution.map((s: any) => [s.status, s.count]);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 30,
      head: [['Status', 'Count']],
      body: statusRows,
      theme: 'striped',
      headStyles: { fillColor: [90, 55, 38] }
    });

    // --- PAGE 4: PURCHASES & AI INSIGHTS ---
    doc.addPage();
    doc.setTextColor(43, 26, 18);
    doc.setFontSize(18)
    doc.text('5. Recent Transactions', 14, 25)
    const transactionRows = recentDynamicOrders.map(o => [o.customer, o.amount, o.status]);
    autoTable(doc, {
      startY: 35,
      head: [['Customer', 'Amount', 'Status']],
      body: transactionRows,
      theme: 'plain',
      headStyles: { fillColor: [43, 26, 18], textColor: [255, 255, 255] }
    });

    doc.setFontSize(22)
    doc.setTextColor(139, 90, 60)
    doc.text('6. AI Insights & Recommendations', 14, (doc as any).lastAutoTable.finalY + 20)
    
    doc.setFontSize(11)
    doc.setTextColor(43, 26, 18)
    let yPos = (doc as any).lastAutoTable.finalY + 35;
    analysis.aiInsights.forEach((insight: string) => {
        doc.text(`• ${insight}`, 14, yPos);
        yPos += 10;
    });

    // FOOTERS
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Generated by Aryam Maps Admin Dashboard | Confidential Business Report', 105, 285, { align: 'center' });
    }

    doc.save(`Aryam-Executive-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }

  if (loading && !dashboardStats) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7] text-[#8b5a3c]">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-serif text-lg">Synchronizing your dashboard data...</p>
          </div>
      )
  }

  const { metrics, charts } = dashboardStats || { 
      metrics: { totalRevenue: '₹0', totalOrders: '0', totalCustomers: '0', productsSold: '0' },
      charts: { revenueTrend: [], categoryDistribution: [], statusDistribution: [], topProducts: [] }
  };

  return (
    <div 
      className="flex-1 min-h-screen p-6 lg:p-8"
      style={{ background: '#FDFBF7' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#1E2430' }}>Executive Dashboard</h1>
            <p style={{ color: '#6E6B5E' }}>Overview of Aryam Maps&apos; real-time performance and analytics</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#d4b896] text-[#8b5a3c] hover:bg-[#fdfaf6] transition-all font-semibold text-sm shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={handleExportDetailedReport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8b5a3c] text-white hover:opacity-90 transition-all font-semibold text-sm shadow-md"
            >
              <FileText className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="bg-white p-4 rounded-xl border border-[rgba(139,90,60,0.1)] shadow-sm mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fdfaf6] border border-[#e6dcd0]">
              <Calendar className="h-4 w-4 text-[#8b5a3c]" />
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent text-sm focus:outline-none font-bold text-[#1E2430]"
              >
                <option value="today">Today</option>
                <option value="week">Past 7 Days</option>
                <option value="month">Past 30 Days</option>
                <option value="year">Life Time</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-[#8b5a3c]">
                <Filter className="w-4 h-4" />
                <span>Fine Filter Applied: </span>
                <span className="font-bold">{dateFilter.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-[#8b5a3c]/60">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">ONLINE</span>
            <span>DATABASE: SUPABASE LIVE</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={TrendingUp}
            title="Total Revenue"
            value={metrics.totalRevenue}
            change="↑ Up-to-date"
            color="indigo"
          />
          <MetricCard
            icon={ShoppingCart}
            title="Total Orders"
            value={metrics.totalOrders}
            change="↑ All history"
            color="blue"
          />
          <MetricCard
            icon={Users}
            title="Total Customers"
            value={metrics.totalCustomers}
            change="↑ Unique reach"
            color="green"
          />
          <MetricCard
            icon={Package}
            title="Products Sold"
            value={metrics.productsSold}
            change="↑ Cumulative items"
            color="purple"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Revenue & Orders Trend (Last 7 Days)">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts.revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D6A07A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D6A07A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,90,60,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="#8b5a3c" fontSize={11} tickMargin={10} />
                <YAxis stroke="#8b5a3c" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: 'none', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D6A07A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Product Category Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.categoryDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Order Status & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Orders by Processing Status">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,90,60,0.1)" vertical={false} />
                <XAxis dataKey="status" stroke="#8b5a3c" fontSize={11} />
                <YAxis stroke="#8b5a3c" fontSize={11} />
                <Tooltip cursor={{ fill: 'rgba(139,90,60,0.05)' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                  {charts.statusDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <TableCard
            title="Most Popular Designs"
            columns={['Product', 'Units Sold', 'Revenue', 'Rating']}
            data={charts.topProducts.map((p: any) => ({
              'Product': p.name,
              'Units Sold': p.sold.toLocaleString(),
              'Revenue': p.revenue,
              'Rating': p.rating
            }))}
          />
        </div>

        {/* Recent Orders List */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.15)' }} className="rounded-xl p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold" style={{ color: '#1E2430' }}>Recent Purchases</h3>
            <button className="text-sm font-semibold text-[#8b5a3c] hover:underline">View All Orders</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {recentDynamicOrders.length === 0 ? (
               <div className="text-center py-12 flex flex-col items-center">
                    <ShoppingCart className="w-10 h-10 text-[#8b5a3c]/30 mb-3" />
                    <p className="text-[#6E6B5E] font-medium">No recent orders identified in the database.</p>
               </div>
            ) : recentDynamicOrders.map((order, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-[#fdfaf6] border border-[#e6dcd0] transition-all hover:bg-white hover:border-[#8b5a3c]">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f7f1e8] flex items-center justify-center font-bold text-[#8b5a3c] shadow-inner">
                        {order.customer.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#1E2430]">{order.customer}</p>
                      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8b5a3c' }}>{order.mapType} <span className="text-gray-400 ml-1">#{order.id}</span></p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-lg" style={{ color: '#1E2430' }}>{order.amount}</p>
                    <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter" style={{
                      background: order.status === 'Completed' ? '#dcfce7' : order.status === 'Processing' ? '#dbeafe' : '#fef9c3',
                      color: order.status === 'Completed' ? '#166534' : order.status === 'Processing' ? '#1e40af' : '#854d0e',
                      border: `1px solid ${order.status === 'Completed' ? '#bbf7d0' : order.status === 'Processing' ? '#bfdbfe' : '#fef08a'}`
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
