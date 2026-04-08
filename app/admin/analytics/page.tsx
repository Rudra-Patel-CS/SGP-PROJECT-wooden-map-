'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar, Download, Eye, Zap, ShoppingCart, TrendingUp, Lock, ArrowUpRight } from 'lucide-react'
import { useEffect } from 'react'

// Analytics data for wooden maps
const analyticsData = [
  { date: '1 Mar', visits: 4200, conversions: 240, orders: 12, revenue: 3600 },
  { date: '2 Mar', visits: 3800, conversions: 221, orders: 10, revenue: 3200 },
  { date: '3 Mar', visits: 4500, conversions: 289, orders: 14, revenue: 4100 },
  { date: '4 Mar', visits: 5200, conversions: 320, orders: 16, revenue: 4800 },
  { date: '5 Mar', visits: 4900, conversions: 301, orders: 15, revenue: 4500 },
  { date: '6 Mar', visits: 5800, conversions: 380, orders: 18, revenue: 5400 },
  { date: '7 Mar', visits: 6200, conversions: 420, orders: 21, revenue: 6300 },
]

const deviceData = [
  { device: 'Desktop', value: 65, conversion: 5.2 },
  { device: 'Mobile', value: 25, conversion: 3.8 },
  { device: 'Tablet', value: 10, conversion: 4.1 },
]

export default function AnalyticsPage() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState(false)

  // Check for existing session authorization
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authorized')
    if (auth === 'true') {
        setIsAuthorized(true)
    }
  }, [])

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === 'sgpproject') {
        setIsAuthorized(true)
        sessionStorage.setItem('admin_authorized', 'true')
        setAuthError(false)
    } else {
        setAuthError(true)
    }
  }

  // --- RENDER LOCK SCREEN ---
  if (!isAuthorized) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fffaf3] p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e6dcd0] overflow-hidden">
                <div className="bg-[#5a3726] p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Analytics Restricted</h2>
                    <p className="text-white/70 text-sm">Please verify your administrator credentials</p>
                </div>
                <div className="p-8">
                    <form onSubmit={handleAuthSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#5a3726] mb-2 uppercase tracking-widest">
                                Master Password
                            </label>
                            <input 
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl bg-[#fffaf3] border ${authError ? 'border-red-500 ring-2 ring-red-100' : 'border-[#e6dcd0]'} focus:outline-none focus:border-[#5a3726] transition-all text-center text-lg font-bold tracking-widest text-[#2b1a12]`}
                                placeholder="••••••••"
                            />
                            {authError && (
                                <p className="text-red-500 text-xs mt-2 font-bold text-center">Unauthorized Attempt. Access Denied.</p>
                            )}
                        </div>
                        <button 
                            type="submit"
                            className="w-full py-4 bg-[#5a3726] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#3b2412] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ArrowUpRight className="h-5 w-5" />
                            Verify & Enter
                        </button>
                    </form>
                    <div className="mt-8 pt-6 border-t border-[#f3ebe2] text-center">
                        <p className="text-[10px] text-[#9b7b65] uppercase tracking-widest font-black">
                            Secure Administrative Session
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
  }
  return (
    <div className="min-h-screen bg-[#fffaf3]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#e6dcd0] bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#2b1a12]">Analytics</h1>
              <p className="text-[#5a3726] text-sm mt-1">Detailed insights into your wooden maps business performance.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                    sessionStorage.removeItem('admin_authorized')
                    setIsAuthorized(false)
                    setPasswordInput('')
                }}
                className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-all font-medium text-sm shadow-sm"
              >
                Lock Session
              </button>
              <button className="flex items-center gap-2 bg-[#5a3726] text-white px-4 py-2 rounded-lg hover:bg-[#3b2412] transition-all font-medium shadow-md">
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-[#f7f1e8] px-4 py-2 rounded-lg border border-[#e6dcd0] text-[#5a3726] hover:bg-[#e6dcd0] transition-colors font-medium text-sm">
              <Calendar className="h-4 w-4" />
              Last 7 Days
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 lg:p-10 space-y-8 pb-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Visitors', value: '47,382', change: '+12.5%', positive: true, icon: Eye },
            { label: 'Click Rate', value: '4.8%', change: '+2.1%', positive: true, icon: Zap },
            { label: 'Orders', value: '1,582', change: '+18.3%', positive: true, icon: ShoppingCart },
            { label: 'Revenue', value: '₹32,420', change: '+22.5%', positive: true, icon: TrendingUp },
          ].map((kpi, idx) => {
            const Icon = kpi.icon
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl bg-white border border-[#e6dcd0] p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#5a3726] text-sm font-medium">{kpi.label}</p>
                    <p className="text-3xl font-serif font-bold text-[#2b1a12] mt-2">{kpi.value}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f7f1e8] text-[#8b5a3c] shadow-sm border border-[#e6dcd0]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className={`text-xs mt-4 font-medium ${kpi.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {kpi.change} vs previous period
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitor Traffic Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white border border-[#e6dcd0] p-6 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-xl font-serif font-bold text-[#2b1a12] mb-6">Visitor Traffic Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5a3c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5a3c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3ebe2" />
                <XAxis dataKey="date" stroke="#9b7b65" tick={{ fill: '#5a3726' }} />
                <YAxis stroke="#9b7b65" tick={{ fill: '#5a3726' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fffaf3', border: '1px solid #e6dcd0', borderRadius: '0.75rem', color: '#2b1a12' }} />
                <Area type="monotone" dataKey="visits" stroke="#8b5a3c" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" name="Visits" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Conversions & Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white border border-[#e6dcd0] p-6 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-xl font-serif font-bold text-[#2b1a12] mb-6">Order Conversions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3ebe2" />
                <XAxis dataKey="date" stroke="#9b7b65" tick={{ fill: '#5a3726' }} />
                <YAxis stroke="#9b7b65" tick={{ fill: '#5a3726' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fffaf3', border: '1px solid #e6dcd0', borderRadius: '0.75rem', color: '#2b1a12' }} cursor={{fill: '#f3ebe2'}} />
                <Bar dataKey="orders" fill="#5a3726" radius={[8, 8, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Device Performance & Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white border border-[#e6dcd0] p-6 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-xl font-serif font-bold text-[#2b1a12] mb-6">Device Distribution</h3>
            <div className="space-y-6">
              {deviceData.map((device, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#5a3726] font-medium">{device.device}</p>
                    <span className="text-sm font-bold text-[#2b1a12]">{device.value}%</span>
                  </div>
                  <div className="w-full bg-[#f3ebe2] rounded-full h-2.5">
                    <div
                      className="bg-[#8b5a3c] h-2.5 rounded-full"
                      style={{ width: `${device.value}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#9b7b65] mt-2">{device.conversion}% conversion rate</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Map Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white border border-[#e6dcd0] p-6 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-xl font-serif font-bold text-[#2b1a12] mb-6">Top Map Pages</h3>
            <div className="space-y-4">
              {[
                { page: 'World Maps', views: 4832, conversion: 5.2 },
                { page: 'USA State Maps', views: 3942, conversion: 4.8 },
                { page: 'Europe Maps', views: 2831, conversion: 4.3 },
                { page: 'Asia Maps', views: 2124, conversion: 6.1 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-[#fffaf3] hover:bg-[#f7f1e8] transition-colors border border-[#e6dcd0]">
                  <div>
                    <p className="text-[#2b1a12] font-semibold text-sm">{item.page}</p>
                    <p className="text-[#5a3726] text-xs mt-1">{item.views} views</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-sm font-bold border border-emerald-100">
                    {item.conversion}%
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

