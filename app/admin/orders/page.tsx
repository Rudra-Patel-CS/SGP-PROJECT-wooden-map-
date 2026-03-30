'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  Filter,
  Download,
  Package,
  Calendar,
  MapPin,
  Phone,
  Mail,
  MoreVertical
} from 'lucide-react'

const orders = [
  {
    id: '#ORD-001',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567'
    },
    date: 'Mar 25, 2024',
    amount: '$425',
    status: 'Completed',
    mapType: 'Premium World Map - Walnut',
    address: 'New York, NY 10001'
  },
  {
    id: '#ORD-002',
    customer: {
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1 (555) 234-5678'
    },
    date: 'Mar 24, 2024',
    amount: '$298',
    status: 'Processing',
    mapType: 'USA State Map - Oak',
    address: 'Los Angeles, CA 90001'
  },
  {
    id: '#ORD-003',
    customer: {
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1 (555) 345-6789'
    },
    date: 'Mar 23, 2024',
    amount: '$512',
    status: 'Pending',
    mapType: 'Europe Map - Mahogany',
    address: 'Chicago, IL 60601'
  },
  {
    id: '#ORD-004',
    customer: {
      name: 'John Wilson',
      email: 'john@example.com',
      phone: '+1 (555) 456-7890'
    },
    date: 'Mar 22, 2024',
    amount: '$360',
    status: 'Completed',
    mapType: 'Asia Map - Teak',
    address: 'Houston, TX 77001'
  },
]

const statusStyles = {
  Completed: 'bg-green-100 text-green-800',
  Processing: 'bg-blue-100 text-blue-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600 text-sm mt-1">Manage and track customer orders for wooden maps.</p>
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium shadow-md">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-600" />
              <input
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-indigo-700 hover:bg-slate-50 transition-colors font-medium">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-8 space-y-6 pb-20 flex-1 w-full lg:pl-64">
        {/* Orders Grid */}
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1 flex gap-6">
                    <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-lg h-fit">
                      <Package className="h-6 w-6 text-indigo-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4 mb-3">
                        <div>
                          <p className="font-bold text-gray-900 text-lg mb-1">{order.id}</p>
                          <p className="text-gray-600 text-sm">{order.customer.name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status as keyof typeof statusStyles]} flex-shrink-0`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-gray-600 text-xs uppercase tracking-widest">Amount</p>
                          <p className="text-gray-900 font-semibold mt-1">{order.amount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs uppercase tracking-widest">Map Type</p>
                          <p className="text-gray-900 font-semibold mt-1 text-sm">{order.mapType}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs uppercase tracking-widest">Date</p>
                          <p className="text-gray-900 font-semibold mt-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> {order.date}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs uppercase tracking-widest">Location</p>
                          <p className="text-gray-900 font-semibold mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <a href={`mailto:${order.customer.email}`} className="text-indigo-700 hover:text-indigo-900 font-medium">
                            {order.customer.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{order.customer.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-gray-900 hover:bg-slate-50 transition-colors font-medium text-sm">
                      View Details
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 p-2">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

