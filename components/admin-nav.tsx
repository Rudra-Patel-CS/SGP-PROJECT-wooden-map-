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
          style={{ background: 'rgba(255,255,255,0.85)', borderColor: '#e6dcd0', color: '#1E2430', backdropFilter: 'blur(12px)' }}
          className=""
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
        style={{ background: '#FDFBF7', borderRight: '1px solid rgba(139,90,60,0.15)', color: '#1E2430' }}
        className={`
          fixed top-0 left-0 h-full w-64
          transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D6A07A 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </div>

          {/* Logo Section */}
          <div className="p-6 pb-2" style={{ borderBottom: '1px solid rgba(139,90,60,0.15)' }}>
            <div className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all" style={{ background: '#F0EBE1' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-lg" style={{ background: '#8b5a3c', color: '#FDFBF7' }}>
                W
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: '#1E2430' }}>Aryam Maps</p>
                <p className="text-[10px] truncate" style={{ color: '#6E6B5E' }}>Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(139,90,60,0.15)' }}>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors" style={{ color: '#8b5a3c' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.2)', color: '#1E2430', borderRadius: '0.5rem' }}
                className="w-full py-2.5 pl-10 pr-4 text-xs placeholder:text-[#6E6B5E] focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 flex-1 overflow-y-auto custom-scrollbar py-6 space-y-6">
            <div>
              <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: '#8b5a3c' }}>Management</p>
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
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 relative overflow-hidden"
                        style={isActive ? {
                          background: '#8b5a3c',
                          color: '#FFFFFF',
                          fontWeight: 600
                        } : {
                          color: '#6E6B5E'
                        }}
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
              <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: '#8b5a3c' }}>Other</p>
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
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300"
                        style={isActive ? {
                          background: '#8b5a3c',
                          color: '#FFFFFF',
                          fontWeight: 600
                        } : {
                          color: '#6E6B5E'
                        }}
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
          <div className="p-4 space-y-3" style={{ borderTop: '1px solid rgba(139,90,60,0.15)' }}>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(139,90,60,0.05)', border: '1px solid rgba(139,90,60,0.15)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: '#F0EBE1', color: '#8b5a3c' }}>
                GH
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate" style={{ color: '#1E2430' }}>Guy Hawkins</p>
                <p className="text-[10px] truncate" style={{ color: '#6E6B5E' }}>Admin</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-red-600/10 border border-red-500/30 text-red-300 hover:bg-red-600/20 hover:text-red-200 transition-all duration-300 text-sm font-medium"
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(214, 160, 122, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(214, 160, 122, 0.5);
        }
      `}</style>
    </>
  )
}
