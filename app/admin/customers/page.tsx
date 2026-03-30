'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  UserPlus
} from 'lucide-react'

const customers = [
  {
    id: 'CUS001',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    totalOrders: 12,
    totalSpent: '$4,850',
    favoriteMap: 'World Maps',
    joinDate: 'Jan 15, 2024',
  },
  {
    id: 'CUS002',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, CA',
    totalOrders: 8,
    totalSpent: '$3,240',
    favoriteMap: 'USA State Maps',
    joinDate: 'Dec 20, 2023',
  },
  {
    id: 'CUS003',
    name: 'Emma Davis',
    email: 'emma@example.com',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, IL',
    totalOrders: 5,
    totalSpent: '$1,920',
    favoriteMap: 'Europe Maps',
    joinDate: 'Feb 10, 2024',
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600 text-sm mt-1">Manage and analyze your wooden maps customer base.</p>
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium shadow-md">
              <UserPlus className="h-4 w-4" />
              Add Customer
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-600" />
              <input
                type="text"
                placeholder="Search customers by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-indigo-700 hover:bg-slate-50 transition-colors font-medium">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-indigo-700 hover:bg-slate-50 transition-colors font-medium">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-8 space-y-4 pb-20 flex-1 w-full lg:pl-64">
        {/* Customers List */}
        {customers.map((customer, idx) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Customer Info */}
              <div className="flex gap-4 flex-1">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {customer.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-lg">{customer.name}</p>
                  <p className="text-gray-600 text-sm">{customer.id}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-widest">Email</p>
                      <p className="text-indigo-700 text-sm mt-1 hover:underline cursor-pointer font-medium">{customer.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-widest">Phone</p>
                      <p className="text-gray-700 text-sm mt-1">{customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-widest">Location</p>
                      <p className="text-gray-700 text-sm mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {customer.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-widest">Favorite Map Type</p>
                      <p className="text-gray-700 text-sm mt-1 font-medium">{customer.favoriteMap}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 flex-shrink-0">
                <div className="text-right">
                  <p className="text-gray-600 text-xs uppercase tracking-widest">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{customer.totalOrders}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-xs uppercase tracking-widest">Total Spent</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">{customer.totalSpent}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-gray-900 hover:bg-slate-50 transition-colors font-medium text-sm">
                    View Profile
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-2">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  )
}
