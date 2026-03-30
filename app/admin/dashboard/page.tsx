'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
  Zap
} from 'lucide-react'

// Mock data - Wooden Maps Business
const revenueData = [
  { date: 'Mon', revenue: 2400, orders: 24 },
  { date: 'Tue', revenue: 3200, orders: 32 },
  { date: 'Wed', revenue: 2800, orders: 28 },
  { date: 'Thu', revenue: 3800, orders: 38 },
  { date: 'Fri', revenue: 4200, orders: 42 },
  { date: 'Sat', revenue: 5100, orders: 51 },
  { date: 'Sun', revenue: 4600, orders: 46 }
]

const mapTypeData = [
  { name: 'World Maps', value: 50, color: '#D6A07A' },
  { name: 'Country Maps', value: 32, color: '#C78F8A' },
  { name: 'State Maps', value: 18, color: '#9C6F73' }
]

const orderStatusData = [
  { status: 'Completed', count: 234, fill: '#10b981' },
  { status: 'Processing', count: 89, fill: '#3b82f6' },
  { status: 'Pending', count: 45, fill: '#eab308' },
  { status: 'Cancelled', count: 12, fill: '#ef4444' }
]

const topProducts = [
  { id: 1, name: 'Premium World Map - Walnut', sold: 345, revenue: '$12,420', rating: '⭐ 4.8' },
  { id: 2, name: 'USA State Map - Oak', sold: 298, revenue: '$10,710', rating: '⭐ 4.7' },
  { id: 3, name: 'Europe Map - Mahogany', sold: 267, revenue: '$10,013', rating: '⭐ 4.9' },
  { id: 4, name: 'Premium World Map - Mahogany', sold: 189, revenue: '$11,340', rating: '⭐ 4.9' }
]

const recentOrders = [
  { id: 'ORD-001', customer: 'John Martinez', amount: '$324', status: 'Completed', mapType: 'World Map' },
  { id: 'ORD-002', customer: 'Sarah Johnson', amount: '$198', status: 'Processing', mapType: 'USA State Map' },
  { id: 'ORD-003', customer: 'Michael Chen', amount: '$456', status: 'Completed', mapType: 'Europe Map' },
  { id: 'ORD-004', customer: 'Emily Wright', amount: '$287', status: 'Processing', mapType: 'USA State Map' }
]

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: '#FFFFFF', borderLeft: `4px solid ${borderColor}` }}
      className="rounded-xl p-6 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold mb-2" style={{ color: borderColor }}>{title}</p>
          <p className="text-2xl font-bold" style={{ color: '#1E2430' }}>{value}</p>
          <p className="text-xs mt-2" style={{ color: '#7E4A4A' }}>↑ {change}</p>
        </div>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: iconBg, color: borderColor }}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.15)' }}
      className="rounded-xl transition-all p-6"
    >
      <h3 className="text-lg font-bold mb-6" style={{ color: '#1E2430' }}>{title}</h3>
      {children}
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.15)' }}
      className="rounded-xl p-6"
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
            {data.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(139,90,60,0.1)' }} className="transition-colors">
                {columns.map((col, i) => (
                  <td key={i} className="py-4 px-4" style={{ color: '#3b2412' }}>
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [dateFilter, setDateFilter] = useState('week')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      className="flex-1 min-h-screen p-6 lg:p-8"
      style={{ background: '#FDFBF7' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1E2430' }}>Dashboard</h1>
          <p style={{ color: '#6E6B5E' }}>Welcome to your wooden maps store analytics</p>
        </motion.div>

        {/* Filter Section */}
        <motion.div variants={itemVariants} className="flex gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.2)' }}>
            <Calendar className="h-4 w-4" style={{ color: '#8b5a3c' }} />
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-sm focus:outline-none font-medium"
              style={{ color: '#1E2430' }}
            >
              <option value="week" style={{ background: '#FFFFFF' }}>This Week</option>
              <option value="month" style={{ background: '#FFFFFF' }}>This Month</option>
              <option value="year" style={{ background: '#FFFFFF' }}>This Year</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm" style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.2)', color: '#1E2430' }}>
            <Filter className="h-4 w-4" style={{ color: '#8b5a3c' }} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-all font-medium text-sm text-white" style={{ background: '#8b5a3c' }}>
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={TrendingUp}
            title="Total Revenue"
            value="$26,420"
            change="12.5% this week"
            color="indigo"
          />
          <MetricCard
            icon={ShoppingCart}
            title="Total Orders"
            value="1,247"
            change="8.2% this week"
            color="blue"
          />
          <MetricCard
            icon={Users}
            title="Total Customers"
            value="2,891"
            change="15.3% this month"
            color="green"
          />
          <MetricCard
            icon={Package}
            title="Products Sold"
            value="3,842"
            change="22.1% this month"
            color="purple"
          />
        </motion.div>

        {/* Charts Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Revenue & Orders Trend">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D6A07A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D6A07A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,90,60,0.1)" />
                <XAxis dataKey="date" stroke="#8b5a3c" />
                <YAxis stroke="#8b5a3c" />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(139,90,60,0.2)', borderRadius: '0.5rem', color: '#1E2430' }} />
                <Area type="monotone" dataKey="revenue" stroke="#D6A07A" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Map Type Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mapTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mapTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* Order Status & Top Products */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Orders by Status">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,90,60,0.1)" />
                <XAxis dataKey="status" stroke="#8b5a3c" />
                <YAxis stroke="#8b5a3c" />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(139,90,60,0.2)', borderRadius: '0.5rem', color: '#1E2430' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <TableCard
            title="Top Selling Products"
            columns={['Product', 'Units Sold', 'Revenue', 'Rating']}
            data={topProducts.map(p => ({
              'Product': p.name,
              'Units Sold': p.sold.toLocaleString(),
              'Revenue': p.revenue,
              'Rating': p.rating
            }))}
          />
        </motion.div>

        {/* Recent Orders */}
        <motion.div variants={itemVariants} style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.15)' }} className="rounded-xl p-6 transition-all">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#1E2430' }}>Recent Orders</h3>
          <div className="grid grid-cols-1 gap-4">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg transition-colors" style={{ border: '1px solid rgba(139,90,60,0.1)' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold" style={{ color: '#1E2430' }}>{order.customer}</p>
                      <p className="text-sm" style={{ color: '#6E6B5E' }}>{order.mapType}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold" style={{ color: '#1E2430' }}>{order.amount}</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{
                      background: order.status === 'Completed' ? 'rgba(156,111,115,0.2)' : order.status === 'Processing' ? 'rgba(214,160,122,0.2)' : 'rgba(110,107,94,0.2)',
                      color: order.status === 'Completed' ? '#7E4A4A' : order.status === 'Processing' ? '#8a5642' : '#6E6B5E'
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div variants={itemVariants} className="rounded-xl p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.15)' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: '#8b5a3c' }}>Conversion Rate</p>
            <p className="text-3xl font-bold" style={{ color: '#1E2430' }}>4.8%</p>
            <p className="text-xs mt-2" style={{ color: '#7E4A4A' }}>↑ 0.3% from last week</p>
          </motion.div>
          <motion.div variants={itemVariants} className="rounded-xl p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.15)' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: '#5A6B7A' }}>Avg Order Value</p>
            <p className="text-3xl font-bold" style={{ color: '#1E2430' }}>$321</p>
            <p className="text-xs mt-2" style={{ color: '#7E4A4A' }}>↑ $12 from last week</p>
          </motion.div>
          <motion.div variants={itemVariants} className="rounded-xl p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.15)' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: '#9C6F73' }}>Unique Visitors</p>
            <p className="text-3xl font-bold" style={{ color: '#1E2430' }}>14.2K</p>
            <p className="text-xs mt-2" style={{ color: '#7E4A4A' }}>↑ 2.1K from last week</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
