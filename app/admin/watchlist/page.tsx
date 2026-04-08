'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Download,
  Heart,
  User,
  Package,
  Calendar,
  ExternalLink,
  Loader2,
  TrendingUp,
  Users,
  Clock,
  ArrowLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface WatchlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  user_email: string
  products: {
    id: string
    name: string
    price: number
    images: string[]
  }
}

export default function AdminWatchlistPage() {
  const router = useRouter()
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/watchlist', {
        headers: { 'x-admin-auth': 'true' }
      })
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (err) {
      console.error("Failed to fetch watchlist:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item => 
    item.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.products?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Analytics Calculation
  const totalItems = items.length
  const uniqueUsers = new Set(items.map(i => i.user_id)).size
  
  const productCounts: Record<string, { name: string, count: number }> = {}
  items.forEach(item => {
    if (item.products) {
      if (!productCounts[item.products.id]) {
        productCounts[item.products.id] = { name: item.products.name, count: 0 }
      }
      productCounts[item.products.id].count++
    }
  })
  
  const mostWatchlisted = Object.values(productCounts).sort((a, b) => b.count - a.count)[0]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffaf3]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#8b5a3c]" />
          <p className="text-[#8b5a3c] font-medium animate-pulse">Analyzing user trends...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] pb-20">
      {/* Header Section */}
      <header className="sticky top-0 z-30 border-b bg-[#f7f1e8]/90 backdrop-blur-md border-[#e6dcd0] shadow-sm">
        <div className="px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/admin/dashboard')}
                className="p-2 rounded-full hover:bg-white/50 transition-colors text-[#8b5a3c]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#2b1a12]">Watchlist Dashboard</h1>
                <p className="text-sm text-[#8b5a3c] mt-1 italic">Monitoring product interest & customer intent</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                onClick={fetchWatchlist}
                title="Refresh Data"
                className="p-2.5 rounded-xl border border-[#e6dcd0] bg-white text-[#5a3726] hover:bg-[#f3ebe2] hover:rotate-180 transition-all duration-500 shadow-sm"
               >
                 <Clock className="w-5 h-5" />
               </button>
               <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5a3726] text-white text-sm font-bold hover:bg-[#3b2412] transition-all shadow-lg active:scale-95">
                 <Download className="h-4 w-4" />
                 Export Data
               </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9b7b65] group-focus-within:text-[#8b5a3c] transition-colors" />
              <input
                type="text"
                placeholder="Search by customer email or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8b5a3c]/30 border border-[#e6dcd0] bg-white text-[#2b1a12] shadow-sm transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-[#e6dcd0] bg-white text-sm font-bold text-[#5a3726] hover:bg-[#f3ebe2] transition-all shadow-sm">
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-8 space-y-10 max-w-7xl mx-auto">
        {/* Analytics Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Items', value: totalItems, icon: Heart, sub: 'Items in customer lists', color: '#ef4444', delay: 0.1 },
            { label: 'Unique Users', value: uniqueUsers, icon: Users, sub: 'Individual shoppers', color: '#8b5a3c', delay: 0.2 },
            { label: 'Top Product', value: mostWatchlisted?.name || 'None', icon: TrendingUp, sub: `${mostWatchlisted?.count || 0} times watchlisted`, color: '#3c8b41', delay: 0.3 }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay, duration: 0.5 }}
              className="bg-white p-7 rounded-3xl border border-[#e6dcd0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-start gap-5 group hover:border-[#8b5a3c]/30 transition-all hover:-translate-y-1"
            >
              <div className="p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300" style={{ background: `${stat.color}10` }}>
                <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[#9b7b65] uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-bold text-[#2b1a12] mt-1 truncate">{stat.value}</h3>
                <p className="text-xs text-[#8b5a3c] mt-2 font-medium opacity-80">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Watchlist Table */}
        <div className="bg-white rounded-3xl border border-[#e6dcd0] shadow-[0_10px_40px_rgb(0,0,0,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f1e8] border-b border-[#e6dcd0]">
                  <th className="py-5 px-8 text-[11px] font-black text-[#8b5a3c] uppercase tracking-[0.15em]">Product Details</th>
                  <th className="py-5 px-8 text-[11px] font-black text-[#8b5a3c] uppercase tracking-[0.15em]">Customer Info</th>
                  <th className="py-5 px-8 text-[11px] font-black text-[#8b5a3c] uppercase tracking-[0.15em]">Unit Price</th>
                  <th className="py-5 px-8 text-[11px] font-black text-[#8b5a3c] uppercase tracking-[0.15em]">Added On</th>
                  <th className="py-5 px-8 text-[11px] font-black text-[#8b5a3c] uppercase tracking-[0.15em] text-center">In Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dcd0]">
                <AnimatePresence mode="popLayout">
                  {filteredItems.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={5} className="py-24 text-center">
                         <div className="relative inline-block">
                           <Heart className="w-20 h-20 mx-auto opacity-5 text-[#8b5a3c]" />
                           <Search className="w-8 h-8 absolute bottom-0 right-0 opacity-10 text-[#8b5a3c]" />
                         </div>
                         <p className="text-[#9b7b65] mt-6 font-medium">No results found for your search criteria.</p>
                         <button onClick={() => setSearchTerm('')} className="mt-4 text-[#8b5a3c] text-sm font-bold hover:underline">Clear Search</button>
                      </td>
                    </motion.tr>
                  ) : (
                    filteredItems.map((item, idx) => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group hover:bg-[#fffaf3]/50 transition-colors"
                      >
                        {/* Product */}
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#f3ebe2] border border-[#e6dcd0] overflow-hidden flex-shrink-0 shadow-sm">
                              {item.products?.images?.[0] ? (
                                <img src={item.products.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                <Package className="w-full h-full p-4 text-[#d4b896]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#2b1a12] truncate max-w-[220px] group-hover:text-[#8b5a3c] transition-colors">{item.products?.name || 'Product Not Found'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] bg-[#f3ebe2] text-[#8b5a3c] px-2 py-0.5 rounded-md font-bold uppercase tracking-tight">#{item.product_id.slice(0,6)}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="py-5 px-8">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[#5a3726]">
                              <User className="w-4 h-4 opacity-50" />
                              <span className="text-sm font-semibold">{item.user_email}</span>
                            </div>
                            <span className="text-[10px] text-[#9b7b65] mt-1 font-medium ml-6 uppercase tracking-wider">{item.user_id.slice(0,12)}...</span>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-5 px-8">
                           <div className="flex flex-col">
                             <span className="text-base font-black text-[#8b5a3c]">₹{item.products?.price?.toLocaleString() || '---'}</span>
                             <span className="text-[10px] text-[#9b7b65] font-medium uppercase">Incl. GST</span>
                           </div>
                        </td>

                        {/* Date */}
                        <td className="py-5 px-8">
                           <div className="flex items-center gap-2.5 text-[#5a3726] bg-[#f3ebe2]/50 px-3 py-1.5 rounded-xl w-fit">
                             <Calendar className="w-3.5 h-3.5 opacity-60" />
                             <div className="flex flex-col">
                               <span className="text-xs font-bold leading-tight">
                                 {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                               </span>
                               <span className="text-[9px] opacity-60 font-medium">
                                 at {new Date(item.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                               </span>
                             </div>
                           </div>
                        </td>

                        {/* Actions / Intent */}
                        <td className="py-5 px-8 text-center">
                           <button 
                            onClick={() => router.push(`/admin/products?id=${item.product_id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#d4b896] text-[#8b5a3c] bg-white hover:bg-[#8b5a3c] hover:text-white transition-all text-xs font-bold shadow-sm"
                           >
                             <ExternalLink className="w-3.5 h-3.5" />
                             View Product
                           </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Footer Metrics */}
          <div className="px-8 py-5 bg-[#f7f1e8]/40 border-t border-[#e6dcd0] flex items-center justify-between">
             <div className="flex items-center gap-4">
               <p className="text-xs text-[#8b5a3c] font-bold">
                 DATA STATUS: <span className="text-[#3c8b41] ml-1">● REALTIME SYNCED</span>
               </p>
               <div className="h-4 w-px bg-[#e6dcd0]" />
               <p className="text-xs text-[#8b5a3c]">
                 Total Insights: <b>{filteredItems.length}</b> rows
               </p>
             </div>
             <div className="flex gap-1">
               {[1, 2, 3].map(i => (
                 <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-[#8b5a3c]' : 'bg-[#e6dcd0]'}`} />
               ))}
             </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #fffaf3;
        }
        ::-webkit-scrollbar-thumb {
          background: #e6dcd0;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #d4b896;
        }
      `}</style>
    </div>
  )
}
