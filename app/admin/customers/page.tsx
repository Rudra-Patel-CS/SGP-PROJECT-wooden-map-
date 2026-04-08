'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  UserPlus,
  Loader2,
  Users,
  X,
  Package
} from 'lucide-react'

type Customer = {
  id: string
  name: string
  email: string
  phone: string
  location: string
  totalOrders: number
  totalSpent: number
  favoriteMap: string
  latestOrderDate: string
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null)
  const [customerDetails, setCustomerDetails] = useState<any | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/customers', {
          headers: {
            'x-admin-auth': 'true'
          }
        });
        if (res.ok) {
          const data = await res.json()
          setCustomers(data)
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = async (email: string) => {
    setSelectedCustomerEmail(email)
    setDetailsLoading(true)
    setCustomerDetails(null)
    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(email)}`, {
        headers: { 'x-admin-auth': 'true' }
      })
      if (res.ok) {
        const data = await res.json()
        setCustomerDetails(data)
      } else {
        console.error("Failed to fetch customer details")
      }
    } catch (err) {
      console.error("Error fetching customer details:", err)
    } finally {
      setDetailsLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedCustomerEmail(null)
    setCustomerDetails(null)
  }

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center p-6 lg:p-8" style={{ background: '#fffaf3' }}>
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#8b5a3c' }} />
        </div>
     );
  }

  return (
    <div className="min-h-screen" style={{ background: '#fffaf3' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b" style={{ background: '#f7f1e8', borderColor: '#e6dcd0' }}>
        <div className="px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#2b1a12]">Customers</h1>
              <p className="text-sm mt-1 text-[#8b5a3c]">Manage and analyze your wooden maps customer base.</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b7b65]" />
              <input
                type="text"
                placeholder="Search customers by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{
                  background: '#fff',
                  border: '1px solid #e6dcd0',
                  color: '#2b1a12',
                  // @ts-ignore
                  '--tw-ring-color': '#8b5a3c',
                }}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors"
                style={{ background: '#fff', borderColor: '#e6dcd0', color: '#5a3726' }}
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors"
               style={{ background: '#fff', borderColor: '#e6dcd0', color: '#5a3726' }}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-8 space-y-4 pb-20 flex-1 w-full flex flex-col">
          {/* Customers Table container */}
          <div className="rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #e6dcd0', background: '#fff' }}>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr style={{ background: '#f7f1e8', borderBottom: '1px solid #e6dcd0' }}>
                          <th className="py-4 px-6 text-xs font-semibold text-[#8b5a3c] uppercase tracking-wider">Customer</th>
                          <th className="py-4 px-6 text-xs font-semibold text-[#8b5a3c] uppercase tracking-wider">Contact</th>
                          <th className="py-4 px-6 text-xs font-semibold text-[#8b5a3c] uppercase tracking-wider">Location</th>
                          <th className="py-4 px-6 text-xs font-semibold text-[#8b5a3c] uppercase tracking-wider">Favorite Map</th>
                          <th className="py-4 px-6 text-xs font-semibold text-[#8b5a3c] uppercase tracking-wider text-right">Orders</th>
                          <th className="py-4 px-6 text-xs font-semibold text-[#8b5a3c] uppercase tracking-wider text-right">Total Spent</th>
                          <th className="py-4 px-6 text-xs font-semibold text-[#8b5a3c] uppercase tracking-wider text-center">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e6dcd0]">
                       {filtered.length === 0 ? (
                           <tr>
                               <td colSpan={7} className="py-12 text-center text-[#9b7b65]">
                                  <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                  <p>No customers found matching your criteria.</p>
                               </td>
                           </tr>
                       ) : (
                           filtered.map((customer, idx) => (
                               <motion.tr 
                                  key={customer.email}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="hover:bg-[#fffaf3] transition-colors"
                               >
                                  {/* Customer Info */}
                                  <td className="py-4 px-6">
                                      <div className="flex items-center gap-3">
                                          <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm" style={{ background: '#8b5a3c' }}>
                                              {customer.name[0]?.toUpperCase() || 'U'}
                                          </div>
                                          <div>
                                              <p className="font-semibold text-[#2b1a12]">{customer.name}</p>
                                              <p className="text-xs text-[#9b7b65]">Joined {new Date(customer.latestOrderDate).toLocaleDateString()}</p>
                                          </div>
                                      </div>
                                  </td>

                                  {/* Contact Info */}
                                  <td className="py-4 px-6 whitespace-nowrap">
                                      <div className="flex flex-col space-y-1">
                                          <a href={`mailto:${customer.email}`} className="text-sm text-[#5a3726] hover:underline flex items-center gap-1.5">
                                             <Mail className="w-3.5 h-3.5 opacity-70" /> {customer.email}
                                          </a>
                                          <span className="text-sm text-[#5a3726] flex items-center gap-1.5">
                                             <Phone className="w-3.5 h-3.5 opacity-70" /> {customer.phone}
                                          </span>
                                      </div>
                                  </td>

                                  {/* Location */}
                                  <td className="py-4 px-6 whitespace-nowrap">
                                      <span className="text-sm text-[#5a3726] flex items-center gap-1.5">
                                         <MapPin className="w-4 h-4 text-[#8b5a3c]" /> 
                                         <span className="truncate max-w-[150px]">{customer.location}</span>
                                      </span>
                                  </td>

                                  {/* Favorite Map */}
                                  <td className="py-4 px-6">
                                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: '#f3ebe2', color: '#5a3726' }}>
                                         {customer.favoriteMap}
                                      </span>
                                  </td>

                                  {/* Orders Count */}
                                  <td className="py-4 px-6 text-right whitespace-nowrap">
                                      <span className="text-base font-bold text-[#2b1a12]">{customer.totalOrders}</span>
                                  </td>

                                  {/* Total Spent */}
                                  <td className="py-4 px-6 text-right whitespace-nowrap">
                                      <span className="text-base font-bold text-[#8b5a3c]">₹{customer.totalSpent.toLocaleString()}</span>
                                  </td>

                                  {/* Actions */}
                                  <td className="py-4 px-6 text-center">
                                      <button 
                                        onClick={() => handleViewDetails(customer.email)}
                                        className="p-2 rounded-lg transition-colors hover:bg-[#e6dcd0] text-[#9b7b65] hover:text-[#2b1a12]">
                                         <MoreVertical className="w-4 h-4" />
                                      </button>
                                  </td>
                               </motion.tr>
                           ))
                       )}
                    </tbody>
                 </table>
              </div>
          </div>
      </main>

      {/* Customer Details Modal */}
      {selectedCustomerEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col shadow-2xl"
            style={{ background: '#fffaf3', border: '1px solid #e6dcd0' }}
          >
             <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#e6dcd0', background: '#f7f1e8' }}>
                <div>
                   <h2 className="text-xl font-serif font-bold text-[#2b1a12]">Customer Details</h2>
                   <p className="text-sm text-[#8b5a3c]">{selectedCustomerEmail}</p>
                </div>
                <button onClick={closeModal} className="p-2 rounded-full hover:bg-[#e6dcd0] transition-colors text-[#9b7b65] hover:text-[#2b1a12]">
                   <X className="w-5 h-5" />
                </button>
             </div>

             <div className="p-6 overflow-y-auto flex-1">
                {detailsLoading ? (
                   <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: '#8b5a3c' }} />
                      <p className="text-[#9b7b65]">Fetching from database...</p>
                   </div>
                ) : customerDetails ? (
                   <div className="space-y-6">
                      {/* Customer Info Card */}
                      <div className="bg-white p-5 rounded-xl border flex flex-col md:flex-row gap-6" style={{ borderColor: '#e6dcd0' }}>
                         <div className="flex-1 space-y-3">
                            <h3 className="font-semibold text-lg text-[#2b1a12]">{customerDetails.name}</h3>
                            <div className="space-y-2 text-sm text-[#5a3726]">
                               <p className="flex items-center gap-2"><Mail className="w-4 h-4 opacity-70" /> {customerDetails.email}</p>
                               <p className="flex items-center gap-2"><Phone className="w-4 h-4 opacity-70" /> {customerDetails.phone}</p>
                               <p className="flex items-center gap-2"><MapPin className="w-4 h-4 opacity-70" /> {customerDetails.location}</p>
                            </div>
                         </div>
                         <div className="flex-1 md:text-right space-y-3 md:border-l pl-0 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0" style={{ borderColor: '#e6dcd0' }}>
                            <div>
                               <p className="text-xs text-[#9b7b65] uppercase tracking-wider mb-1">Total Spent</p>
                               <p className="text-2xl font-bold text-[#8b5a3c]">₹{customerDetails.totalSpent?.toLocaleString()}</p>
                            </div>
                            <div>
                               <p className="text-xs text-[#9b7b65] uppercase tracking-wider mb-1">Total Orders</p>
                               <p className="text-lg font-semibold text-[#2b1a12]">{customerDetails.totalOrders}</p>
                            </div>
                         </div>
                      </div>

                      {/* Order History */}
                      <div>
                         <h3 className="text-lg font-serif font-bold text-[#2b1a12] mb-4 flex items-center gap-2">
                             <Package className="w-5 h-5 text-[#8b5a3c]" /> Order History
                         </h3>
                         <div className="space-y-3">
                            {customerDetails.orders?.map((order: any) => (
                               <div key={order.id} className="bg-white p-4 rounded-xl border border-[#e6dcd0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div>
                                     <p className="text-sm font-semibold text-[#2b1a12] mb-1">Order #{order.id.slice(0, 8)}</p>
                                     <p className="text-xs text-[#9b7b65]">{new Date(order.created_at).toLocaleString()}</p>
                                     <div className="mt-2 flex flex-wrap gap-1">
                                        {order.order_items?.map((item: any) => (
                                           <span key={item.id} className="text-[10px] px-2 py-0.5 rounded bg-[#f3ebe2] text-[#5a3726] border border-[#e6dcd0]">
                                              {item.products?.name} (x{item.quantity})
                                           </span>
                                        ))}
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className="font-bold text-[#8b5a3c]">₹{order.total_amount?.toLocaleString()}</p>
                                     <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#e8f3e2] text-[#3c8b41] capitalize">
                                        {order.status || 'placed'}
                                     </span>
                                  </div>
                               </div>
                            ))}
                            {(!customerDetails.orders || customerDetails.orders.length === 0) && (
                               <p className="text-sm text-[#9b7b65] italic">No orders found for this customer.</p>
                            )}
                         </div>
                      </div>
                   </div>
                ) : (
                   <div className="text-center py-12 text-[#9b7b65]">
                      <p>Could not load customer details.</p>
                   </div>
                )}
             </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
