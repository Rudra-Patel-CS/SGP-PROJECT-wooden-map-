'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  ChevronRight,
  Sparkles,
  Search,
  Bell,
  FileText,
  MessageSquare,
  Star,
  HelpCircle,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

const dashboardItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
]

const settingItems = [
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Help', href: '/admin/help', icon: HelpCircle },
]

export function AdminNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminEmail')
    window.location.href = '/login'
  }

  if (!mounted) return null

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-slate-900/80 backdrop-blur-md shadow-lg border-slate-700 text-white hover:bg-slate-800"
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100
          w-64 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          border-r border-slate-700/50 shadow-2xl
        `}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </div>

          {/* Logo Section */}
          <div className="p-6 pb-2 border-b border-slate-700/30">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-serif font-bold text-lg">
                A
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">Aryam Maps</p>
                <p className="text-[10px] text-blue-200 truncate font-medium">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="px-4 py-4 border-b border-slate-700/30">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 flex-1 overflow-y-auto custom-scrollbar py-6 space-y-6">
            <div>
              <p className="px-3 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Management</p>
              <div className="space-y-1">
                {dashboardItems.map((item, index) => {
                  const isActive = pathname.startsWith(item.href)
                  const Icon = item.icon
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 relative overflow-hidden
                          ${isActive 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }
                        `}
                      >
                        <div className={`relative z-10 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`}>
                          <Icon className={`h-4.5 w-4.5`} />
                        </div>
                        
                        <span className="relative z-10 text-[13px] tracking-wide">{item.name}</span>
                        
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto relative z-10"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </motion.div>
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="px-3 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Other</p>
              <div className="space-y-1">
                {settingItems.map((item, index) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (dashboardItems.length + index) * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }
                        `}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        <span className="text-[13px] tracking-wide">{item.name}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-700/30 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                GH
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">Guy Hawkins</p>
                <p className="text-[10px] text-slate-400 truncate">Admin</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-red-600/10 border border-red-600/30 text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all duration-300 text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>
    </>
  )
}
