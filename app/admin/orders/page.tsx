'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Download,
  Package,
  Calendar,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  ChevronDown,
  Loader2,
  X,
  CreditCard
} from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

// Define Order type based on our database schema
type OrderItem = {
  id: string
  product_id: string
  quantity: number
  price: number
  size: string
  color: string
  products: {
    id: string
    name: string
    images: string[]
  }
}

type Order = {
  id: string
  user_id: string
  created_at: string
  status: string
  total_amount: number
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip: string
  shipping_country: string
  contact_email: string
  contact_phone: string
  order_items: OrderItem[]
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  Completed: {
    label: 'Completed',
    bg: 'bg-[#e8f5e9]',
    text: 'text-[#2e7d32]',
    dot: 'bg-[#4caf50]',
  },
  Processing: {
    label: 'Processing',
    bg: 'bg-[#fff8e6]',
    text: 'text-[#8b5a3c]',
    dot: 'bg-[#d4a752]',
  },
  Pending: {
    label: 'Pending',
    bg: 'bg-[#fdf3e7]',
    text: 'text-[#a0522d]',
    dot: 'bg-[#cd853f]',
  },
  Cancelled: {
    label: 'Cancelled',
    bg: 'bg-[#fdecea]',
    text: 'text-[#c62828]',
    dot: 'bg-[#ef9a9a]',
  },
}

function getDisplayStatus(dbStatus: string) {
  if (dbStatus === 'placed') return 'Pending';
  if (dbStatus === 'shipped' || dbStatus === 'delivered') return 'Completed';
  if (dbStatus === 'crafting') return 'Processing';
  if (dbStatus === 'cancelled') return 'Cancelled';
  return 'Pending';
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const statuses = ['All', 'Completed', 'Processing', 'Pending', 'Cancelled']

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders', {
        headers: {
          'x-admin-auth': 'true'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [])

  const filtered = orders.filter((o) => {
    const displayStatus = getDisplayStatus(o.status);
    
    // Build some searchable text
    const searchString = `
      ${o.id.toLowerCase()} 
      ${(o.shipping_address || '').toLowerCase()}
      ${(o.contact_email || '').toLowerCase()}
      ${o.order_items?.map(it => (it.products?.name || '')).join(' ').toLowerCase()}
    `;
    
    const matchSearch = searchString.includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || displayStatus === statusFilter
    
    return matchSearch && matchStatus
  })

  const updateOrderStatus = async (id: string, newStatus: string) => {
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'true'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchOrders();
    } catch (e) {
      console.error(e);
    }
  }

  // Export orders to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF()
    const reportDate = format(new Date(), 'dd/MM/yyyy HH:mm')
    
    // Header - Aryam Maps
    doc.setFontSize(22)
    doc.setTextColor(43, 26, 18) // #2b1a12
    doc.text('Aryam Maps', 14, 22)
    
    // Subheader - Report Title & Date
    doc.setFontSize(12)
    doc.setTextColor(139, 90, 60) // #8b5a3c
    doc.text('Order Management Report', 14, 30)
    doc.setFontSize(10)
    doc.setTextColor(155, 123, 101) // #9b7b65
    doc.text(`Generated on: ${reportDate}`, 14, 37)
    
    // Optional: Filter Info
    if (statusFilter !== 'All' || searchTerm) {
      doc.setFontSize(9)
      const filterText = `Filters: Status [${statusFilter}] ${searchTerm ? `| Search [${searchTerm}]` : ''}`
      doc.text(filterText, 14, 43)
    }

    // Build Table Data
    const tableData = filtered.map((o) => {
      const displayStatus = getDisplayStatus(o.status)
      const date = format(new Date(o.created_at), 'dd MMM yyyy')
      const items = o.order_items?.map(it => it.products?.name || 'Custom Map').join(', ')
      
      return [
        o.id.split('-')[0].toUpperCase(),
        o.contact_email?.split('@')[0] || 'Guest',
        date,
        items,
        `Rs. ${o.total_amount?.toLocaleString()}`,
        displayStatus
      ]
    })

    // Generate Table
    autoTable(doc, {
      startY: 48,
      head: [['ID', 'Customer', 'Date', 'Items', 'Amount', 'Status']],
      body: tableData,
      headStyles: {
        fillColor: [90, 55, 38], // #5a3726
        textColor: [255, 250, 243], // #fffaf3
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [43, 26, 18], // #2b1a12
      },
      alternateRowStyles: {
        fillColor: [247, 241, 232], // #f7f1e8
      },
      margin: { top: 48 },
      didDrawPage: (data) => {
        // Footer (Page Number)
        const totalPages = doc.getNumberOfPages()
        const str = `Page ${totalPages}`
        doc.setFontSize(8)
        const pageSize = doc.internal.pageSize
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
        doc.text(str, data.settings.margin.left, pageHeight - 10)
      }
    })

    // Download PDF
    doc.save(`Aryam-Maps-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }

  const deleteOrder = async (id: string) => {
    setOpenMenuId(null);
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          'x-admin-auth': 'true'
        }
      });
      if (res.ok) {
         if (selectedOrder?.id === id) setSelectedOrder(null);
         fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#fffaf3' }}>
            <Loader2 className="h-8 w-8 animate-spin text-[#8b5a3c]" />
        </div>
     );
  }

  return (
    <div className="min-h-screen" style={{ background: '#fffaf3' }}>

      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{ background: '#f7f1e8', borderColor: '#e6dcd0' }}
      >
        <div className="px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-serif font-semibold" style={{ color: '#2b1a12' }}>
                Orders
              </h1>
              <p className="text-sm mt-0.5" style={{ color: '#8b5a3c' }}>
                Manage and track customer orders for wooden maps.
              </p>
            </div>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all shadow-sm active:scale-95"
              style={{ background: '#5a3726' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#3b2412')}
              onMouseLeave={e => (e.currentTarget.style.background = '#5a3726')}
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: '#9b7b65' }}
              />
              <input
                placeholder="Search orders, customers, map type..."
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
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: '#fff',
                  border: '1px solid #e6dcd0',
                  color: '#5a3726',
                }}
              >
                <Filter className="h-4 w-4" />
                {statusFilter === 'All' ? 'Filter by Status' : statusFilter}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showFilterMenu && (
                <div
                  className="absolute right-0 mt-1 w-44 rounded-lg shadow-lg z-10 overflow-hidden"
                  style={{ background: '#fff', border: '1px solid #e6dcd0' }}
                >
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setShowFilterMenu(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{
                        color: statusFilter === s ? '#5a3726' : '#2b1a12',
                        background: statusFilter === s ? '#f7f1e8' : 'transparent',
                        fontWeight: statusFilter === s ? 600 : 400,
                      }}
                      onMouseEnter={e => { if (statusFilter !== s) e.currentTarget.style.background = '#fdfaf6' }}
                      onMouseLeave={e => { if (statusFilter !== s) e.currentTarget.style.background = 'transparent' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: orders.length },
            { label: 'Completed', value: orders.filter(o => getDisplayStatus(o.status) === 'Completed').length },
            { label: 'Processing', value: orders.filter(o => getDisplayStatus(o.status) === 'Processing').length },
            { label: 'Pending', value: orders.filter(o => getDisplayStatus(o.status) === 'Pending').length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl px-4 py-3"
              style={{ background: '#fff', border: '1px solid #e6dcd0' }}
            >
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#9b7b65' }}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold" style={{ color: '#2b1a12' }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <main className="px-6 lg:px-8 pb-12">
        <p className="text-sm mb-4" style={{ color: '#9b7b65' }}>
          Showing {filtered.length} of {orders.length} orders
        </p>

        {filtered.length === 0 ? (
          <div
            className="rounded-xl p-16 text-center"
            style={{ background: '#fff', border: '1px solid #e6dcd0' }}
          >
            <Package className="h-12 w-12 mx-auto mb-4" style={{ color: '#d4b896' }} />
            <p className="font-serif text-lg mb-1" style={{ color: '#2b1a12' }}>No orders found</p>
            <p className="text-sm" style={{ color: '#9b7b65' }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const displayStatus = getDisplayStatus(order.status);
              const cfg = statusConfig[displayStatus] || statusConfig['Pending']
              
              // Get primary map name
              const mapType = order.order_items && order.order_items.length > 0 
                    ? (order.order_items[0].products?.name || 'Custom Map') + (order.order_items.length > 1 ? ` +${order.order_items.length - 1} more` : '')
                    : 'Unknown Map';
                    
              // Use contact email as customer name if we dont have one
              const customerName = order.contact_email ? order.contact_email.split('@')[0] : 'Guest';

              return (
                <div
                  key={order.id}
                  className="rounded-xl overflow-hidden transition-shadow hover:shadow-md relative"
                  style={{ background: '#fff', border: '1px solid #e6dcd0' }}
                >
                  {/* Card top accent strip */}
                  <div className="h-1 w-full" style={{ background: '#8b5a3c' }} />

                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      {/* Left: Icon + Info */}
                      <div className="flex gap-5 flex-1 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: '#f7f1e8' }}
                        >
                          <Package className="h-5 w-5" style={{ color: '#8b5a3c' }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Order ID + Status */}
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <p className="font-bold font-mono text-lg" style={{ color: '#2b1a12' }}>
                              #{order.id.split('-')[0].toUpperCase()}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </div>

                          <p className="text-sm font-medium mb-3" style={{ color: '#5a3726' }}>
                            {customerName}
                          </p>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9b7b65' }}>
                                Amount
                              </p>
                              <p className="font-semibold text-sm" style={{ color: '#2b1a12' }}>
                                ₹{(order.total_amount || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9b7b65' }}>
                                Map Type
                              </p>
                              <p className="font-medium text-sm truncate" style={{ color: '#2b1a12' }}>
                                {mapType}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9b7b65' }}>
                                Date
                              </p>
                              <p className="font-medium text-sm flex items-center gap-1" style={{ color: '#2b1a12' }}>
                                <Calendar className="h-3 w-3" style={{ color: '#9b7b65' }} />
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9b7b65' }}>
                                Location
                              </p>
                              <p className="font-medium text-sm flex items-center gap-1 truncate" style={{ color: '#2b1a12' }}>
                                <MapPin className="h-3 w-3 shrink-0" style={{ color: '#9b7b65' }} />
                                {order.shipping_city || 'N/A'}, {order.shipping_state || ''}
                              </p>
                            </div>
                          </div>

                          {/* Contact */}
                          <div
                            className="flex items-center gap-5 mt-4 pt-4 flex-wrap"
                            style={{ borderTop: '1px solid #e6dcd0' }}
                          >
                            <a
                              href={`mailto:${order.contact_email}`}
                              className="flex items-center gap-2 text-sm transition-colors"
                              style={{ color: '#8b5a3c' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail className="h-3.5 w-3.5" />
                              {order.contact_email || 'No Email'}
                            </a>
                            <span className="flex items-center gap-2 text-sm" style={{ color: '#5a3726' }}>
                              <Phone className="h-3.5 w-3.5" style={{ color: '#9b7b65' }} />
                              {order.contact_phone || 'No Phone'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          style={{
                            background: '#f7f1e8',
                            border: '1px solid #e6dcd0',
                            color: '#5a3726',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#e6dcd0')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#f7f1e8')}
                        >
                          View Details
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: '#9b7b65' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#5a3726')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#9b7b65')}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {openMenuId === order.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl border bg-white overflow-hidden z-50">
                                <ul className="py-1">
                                    <li>
                                        <button onClick={() => updateOrderStatus(order.id, 'crafting')} className="w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-50">
                                            Mark processing
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50">
                                            Mark Completed
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                                            Mark Cancelled
                                        </button>
                                    </li>
                                    <li className="border-t">
                                        <button onClick={() => deleteOrder(order.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
                                            Delete order
                                        </button>
                                    </li>
                                </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal View Details */}
      {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
              <div 
                className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col" 
                onClick={(e) => e.stopPropagation()}
              >
                  <div className="p-6 border-b flex justify-between items-center" style={{ background: '#f7f1e8' }}>
                      <div>
                          <h2 className="text-xl font-serif font-bold text-[#2b1a12]">Order Details</h2>
                          <p className="text-sm font-mono text-[#8b5a3c]">#{selectedOrder.id.split('-')[0].toUpperCase()}</p>
                      </div>
                      <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-[#e6dcd0] rounded-full transition-colors text-[#5a3726]">
                          <X className="w-5 h-5"/>
                      </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto">
                     <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Customer Info</h3>
                            <p className="font-medium text-gray-900">{selectedOrder.contact_email?.split('@')[0] || 'Guest'}</p>
                            <p className="text-sm text-gray-600">{selectedOrder.contact_email}</p>
                            <p className="text-sm text-gray-600">{selectedOrder.contact_phone || 'No phone'}</p>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Shipping Address</h3>
                            <p className="text-sm text-gray-800">{selectedOrder.shipping_address}</p>
                            <p className="text-sm text-gray-800">{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}</p>
                            <p className="text-sm text-gray-800">{selectedOrder.shipping_country}</p>
                        </div>
                     </div>
                     
                     <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 border-b pb-2">Order Items</h3>
                     <div className="space-y-4 mb-6">
                        {selectedOrder.order_items?.map((item) => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                                       <Package className="w-6 h-6 text-gray-400"/>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">{item.products?.name || 'Custom Map'}</p>
                                        <p className="text-xs text-gray-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-sm text-gray-900">₹{item.price.toLocaleString()}</p>
                            </div>
                        ))}
                     </div>
                     
                     <div className="flex justify-between items-center pt-4 border-t">
                        <span className="font-medium text-gray-900">Total Amount</span>
                        <span className="text-xl font-bold text-[#8b5a3c]">₹{selectedOrder.total_amount?.toLocaleString()}</span>
                     </div>

                  </div>
              </div>
          </div>
      )}

    </div>
  )
}
