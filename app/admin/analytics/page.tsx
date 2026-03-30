'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar, Download, Eye, Zap, ShoppingCart, TrendingUp } from 'lucide-react'

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 text-sm mt-1">Detailed insights into your wooden maps business performance.</p>
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium shadow-md">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-indigo-700 hover:bg-slate-50 transition-colors font-medium">
              <Calendar className="h-4 w-4" />
              Last 7 Days
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-8 space-y-8 pb-20 flex-1 w-full lg:pl-64">
        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Visitors', value: '47,382', change: '+12.5%', positive: true, icon: Eye, color: 'indigo' },
            { label: 'Click Rate', value: '4.8%', change: '+2.1%', positive: true, icon: Zap, color: 'blue' },
            { label: 'Orders', value: '1,582', change: '+18.3%', positive: true, icon: ShoppingCart, color: 'green' },
            { label: 'Revenue', value: '$32,420', change: '+22.5%', positive: true, icon: TrendingUp, color: 'purple' },
          ].map((kpi, idx) => {
            const Icon = kpi.icon
            const bgColor = kpi.color === 'indigo' ? 'bg-indigo-100 text-indigo-700'
              : kpi.color === 'blue' ? 'bg-blue-100 text-blue-700'
              : kpi.color === 'green' ? 'bg-green-100 text-green-700'
              : 'bg-purple-100 text-purple-700'
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{kpi.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${bgColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className={`text-xs mt-4 ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
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
            className="rounded-lg bg-white border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Visitor Traffic Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                <Area type="monotone" dataKey="visits" stroke="#4f46e5" fillOpacity={1} fill="url(#colorVisits)" name="Visits" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Conversions & Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Conversions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Device Performance & Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Device Distribution</h3>
            <div className="space-y-4">
              {deviceData.map((device, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-700 font-medium">{device.device}</p>
                    <span className="text-sm font-semibold text-gray-900">{device.value}%</span>
                  </div>
                  <div className="w-full bg-indigo-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-indigo-700 h-2 rounded-full"
                      style={{ width: `${device.value}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{device.conversion}% conversion rate</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Map Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Map Pages</h3>
            <div className="space-y-4">
              {[
                { page: 'World Maps', views: 4832, conversion: 5.2 },
                { page: 'USA State Maps', views: 3942, conversion: 4.8 },
                { page: 'Europe Maps', views: 2831, conversion: 4.3 },
                { page: 'Asia Maps', views: 2124, conversion: 6.1 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200">
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{item.page}</p>
                    <p className="text-gray-600 text-xs mt-1">{item.views} views</p>
                  </div>
                  <span className="text-green-700 text-sm font-semibold">{item.conversion}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
