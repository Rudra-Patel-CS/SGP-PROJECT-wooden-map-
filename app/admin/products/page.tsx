'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Trash2, Pencil, Plus, X, Upload, Loader2, Globe, MapPin, Building, Ruler, Download, Info } from 'lucide-react'
import { MAP_SIZES, normalizeSizeId, getDefaultPriceForSize } from '@/lib_supabase/constants'
import { ReviewInsightModal } from '@/components/admin/review-insight-modal'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  size: string
  badge: string | null
  image_url: string | null
  images: string[]
  features: string[]
  specifications: Record<string, string>
  rating: number
  reviews_count: number
  is_active: boolean
  featured: boolean
  created_at: string
}

const DEFAULT_SPECS: Record<string, string> = {
  'Map Type': 'Physical',
  'Lamination': 'Waterproof',
  'Language': 'English',
  'Material': 'Wooden',
  'Usage': 'Home, Coaching, Office, School',
  'Color': 'MULTI COLOR',
  'Surface Finish': 'POLISH',
  'Service Duration': 'WITH INSTALLATION',
  'Capacity': '10 YEAR AND MORE',
  'Packaging Type': 'BOX PACK',
}

const emptyForm = {
  name: '',
  description: '',
  price: '8000',
  stock: '50',
  category: 'world',
  size: 'all',
  badge: '',
  features: '',
  featured: false,
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCustomPrice, setIsCustomPrice] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [specifications, setSpecifications] = useState<Record<string, string>>({ ...DEFAULT_SPECS })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedProductForReviews, setSelectedProductForReviews] = useState<Product | null>(null)

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/login')
    }
  }, [router])

  // Fetch all products (including inactive for admin)
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/products?all=true', {
        headers: { 'x-admin-auth': 'true' },
      })
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Upload image
  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'x-admin-auth': 'true' },
      body: formData,
    })

    if (res.ok) {
      const data = await res.json()
      return data.url
    }
    return null
  }

  // Handle form submission (add or edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Upload all images
      const uploadedUrls: string[] = []
      for (const file of imageFiles) {
        const url = await uploadImage(file)
        if (url) uploadedUrls.push(url)
      }

      // Keep existing image previews that are URLs (not blobs)
      const existingUrls = imagePreviews.filter(p => p.startsWith('http'))
      const allImageUrls = [...existingUrls, ...uploadedUrls]

      // Ensure price and stock are valid numbers
      const finalPrice = parseFloat(formData.price) || 0;
      const finalStock = parseInt(formData.stock) || 0;

      const productData = {
        name: formData.name,
        description: formData.description,
        price: finalPrice,
        stock: finalStock,
        category: formData.category,
        size: formData.size,
        badge: formData.badge || null,
        image_url: allImageUrls[0] || null,
        images: allImageUrls,
        features: formData.features
          .split('\n')
          .map(f => f.trim())
          .filter(f => f.length > 0),
        specifications,
        featured: formData.featured,
      }

      const url = editingId ? `/api/products/${editingId}` : '/api/products'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'true',
        },
        body: JSON.stringify(productData),
      })

      if (res.ok) {
        setSuccess(editingId ? 'Product updated successfully!' : 'Product added successfully!')
        resetForm()
        await fetchProducts()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setError('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  // Soft Delete product (marks as inactive)
  const handleDelete = async (id: string) => {
    if (!confirm('Move this product to the trash? It can be restored later.')) return

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-auth': 'true' },
      })

      if (res.ok) {
        setSuccess('Product moved to trash!')
        fetchProducts()
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch {
      setError('Failed to soft-delete product')
    }
  }

  // Permanent Delete product (removes from database)
  const handlePermanentDelete = async (id: string) => {
    if (!confirm('⚠️ WARNING: This will permanently delete this product from the database. This action CANNOT be undone. Are you sure?')) return

    try {
      const res = await fetch(`/api/products/${id}?permanent=true`, {
        method: 'DELETE',
        headers: { 'x-admin-auth': 'true' },
      })

      if (res.ok) {
        setSuccess('Product permanently deleted!')
        fetchProducts()
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch {
      setError('Failed to permanently delete product')
    }
  }

  // Restore (re-activate) a soft-deleted product
  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'true',
        },
        body: JSON.stringify({ is_active: true }),
      })

      if (res.ok) {
        setSuccess('Product restored!')
        fetchProducts()
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch {
      setError('Failed to restore product')
    }
  }

  // Export inventory to PDF report
  const handleExportPDF = () => {
    const doc = new jsPDF()
    const reportDate = format(new Date(), 'dd/MM/yyyy HH:mm')
    
    // Header - Aryam Maps
    doc.setFontSize(22)
    doc.setTextColor(43, 26, 18) // #2b1a12
    doc.text('Aryam Maps', 14, 22)
    
    // Subheader - Report Title & Date
    doc.setFontSize(14)
    doc.setTextColor(139, 90, 60) // #8b5a3c
    doc.text('Inventory Status Report', 14, 30)
    doc.setFontSize(10)
    doc.setTextColor(155, 123, 101) // #9b7b65
    doc.text(`Generated on: ${reportDate}`, 14, 37)

    // Summary Section
    const activeCount = products.filter(p => p.is_active).length
    const inactiveCount = products.length - activeCount

    doc.setFillColor(247, 241, 232) // #f7f1e8
    doc.roundedRect(14, 45, 182, 25, 3, 3, 'F')
    
    doc.setFontSize(9)
    doc.setTextColor(90, 55, 38) // #5a3726
    doc.text('INVENTORY SUMMARY', 20, 52)
    
    doc.setFontSize(11)
    doc.setTextColor(43, 26, 18)
    doc.text(`Total Products: ${products.length}`, 20, 62)
    doc.text(`Available: ${activeCount}`, 70, 62)
    doc.text(`Inactive (Trash): ${inactiveCount}`, 120, 62)

    // Table Setup
    const tableData = products.map((p) => [
      p.id.split('-')[0].toUpperCase(),
      p.name,
      p.category,
      `Rs. ${p.price.toLocaleString()}`,
      p.stock.toString(),
      p.is_active ? 'Available' : 'Deleted'
    ])

    autoTable(doc, {
      startY: 75,
      head: [['ID', 'Product Name', 'Category', 'Price', 'Stock', 'Status']],
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
        fillColor: [253, 250, 246], // #fdfaf6
      },
      margin: { top: 75 },
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
    doc.save(`Aryam-Maps-Inventory-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }

  // Edit product
  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      size: product.size,
      badge: product.badge || '',
      features: (product.features || []).join('\n'),
      featured: product.featured || false,
    })

    // Check if the current price is a custom one or a standard one
    const standardPrice = getDefaultPriceForSize(product.size);
    setIsCustomPrice(product.price !== standardPrice);

    setSpecifications(product.specifications || { ...DEFAULT_SPECS })
    setImagePreviews(product.images || (product.image_url ? [product.image_url] : []))
    setImageFiles([])
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setSpecifications({ ...DEFAULT_SPECS })
    setImageFiles([])
    setImagePreviews([])
    setEditingId(null)
    setShowForm(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = 3 - imagePreviews.length
    const newFiles = files.slice(0, remaining)

    if (newFiles.length > 0) {
      setImageFiles(prev => [...prev, ...newFiles])
      const newPreviews = newFiles.map(f => URL.createObjectURL(f))
      setImagePreviews(prev => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    // Also remove from files if it was a new upload
    const existingUrlCount = imagePreviews.filter(p => p.startsWith('http')).length
    if (index >= existingUrlCount) {
      const fileIndex = index - existingUrlCount
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex))
    }
  }

  const updateSpec = (key: string, value: string) => {
    setSpecifications(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-[#fffaf3]">
      <header className="bg-[#f7f1e8] shadow-sm sticky top-0 z-10 border-b border-[#e6dcd0]">
        <div className="px-4 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#2b1a12]">Manage Products</h1>
            <p className="text-sm text-[#5a3726]">Add, edit, or remove products from your store</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleExportPDF}
              className="bg-white border-[#d4b896] text-[#5a3726] hover:bg-[#f3ebe2] gap-2 shadow-sm font-semibold" 
              variant="outline"
            >
              <Download className="w-4 h-4" />
              Download Inventory Report
            </Button>
            <Button onClick={() => { resetForm(); setShowForm(!showForm); }}
              className="gap-2 bg-[#5a3726] hover:bg-[#3b2412] text-white shadow-md">
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Cancel' : 'Add Product'}
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 lg:px-8 py-8 max-w-6xl mx-auto">
        {/* Status messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between">
            {error}
            <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <Card className="mb-8 border-[#e6dcd0] shadow-lg rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-[#f7f1e8] border-b border-[#e6dcd0] pb-4">
              <CardTitle className="font-serif text-[#2b1a12] text-xl">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Classic World Map" required />
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label htmlFor="price" className="mb-0">Price (₹) *</Label>
                      <button type="button"
                           onClick={() => {
                             const newCustom = !isCustomPrice;
                             setIsCustomPrice(newCustom);
                             if (!newCustom) {
                               setFormData(prev => ({ ...prev, price: getDefaultPriceForSize(prev.size).toString() }));
                             }
                           }}
                           className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                              isCustomPrice 
                                ? 'bg-[#8b5a3c] text-white border-[#8b5a3c]' 
                                : 'bg-[#fffaf3] text-[#8b5a3c] border-[#e6dcd0] hover:bg-[#f7f1e8]'
                           }`}>
                        <div className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center ${isCustomPrice ? 'bg-white border-white' : 'bg-white border-[#d4b896]'}`}>
                          {isCustomPrice && <X className="w-2 h-2 text-[#8b5a3c]" />}
                        </div>
                        {isCustomPrice ? 'Customizing Price' : 'Standard Price (Auto)'}
                      </button>
                    </div>
                    <div className="relative">
                      <Input id="price" type="number" step="0.01" min="0" value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        disabled={!isCustomPrice}
                        className={!isCustomPrice ? "bg-[#f9f9f9] text-[#8b5a3c]/70 border-dashed" : ""}
                        placeholder="2000" required />
                      {!isCustomPrice && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className="text-[9px] font-black text-[#8b5a3c] uppercase tracking-wider">Auto-Calc</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input id="stock" type="number" min="0" value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="50" required />
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select id="category" value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 py-2 text-sm rounded-md border border-[#d4b896] bg-white text-[#2b1a12]">
                      <option value="world">World Maps</option>
                      <option value="country">Country Maps</option>
                      <option value="city">City Maps</option>
                    </select>
                  </div>

                  {/* Size */}
                  <div>
                    <Label htmlFor="size">Size Availability *</Label>
                    <select id="size" value={formData.size}
                      onChange={(e) => {
                        const newSize = e.target.value;
                        setFormData(prev => ({ 
                          ...prev, 
                          size: newSize,
                          price: !isCustomPrice ? getDefaultPriceForSize(newSize).toString() : prev.price
                        }));
                      }}
                      className="w-full h-10 px-3 py-2 text-sm rounded-md border border-[#d4b896] bg-white text-[#2b1a12]">
                      <option value="all">All Sizes (XS to XXL)</option>
                      {MAP_SIZES.map(s => (
                        <option key={s.id} value={s.id}>{s.label} ({s.dimensions})</option>
                      ))}
                    </select>
                    {!isCustomPrice && formData.size === 'all' && (
                      <p className="text-[9px] text-[#8b5a3c] mt-1.5 italic font-medium">✨ All-Size pricing is handled dynamically for customers (Starts at ₹8000).</p>
                    )}
                    <p className="text-[10px] text-[#8b5a3c] mt-1">If "All Sizes" is selected, the product will be available in all size categories on the user side.</p>
                  </div>

                  {/* Badge */}
                  <div>
                    <Label htmlFor="badge">Badge (optional)</Label>
                    <Input id="badge" value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Best Seller, New, Premium" />
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                    className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                      formData.featured ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                      formData.featured ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <div>
                    <p className="text-sm font-bold text-amber-900">⭐ Feature on Homepage</p>
                    <p className="text-xs text-amber-700">When enabled, this product will appear in the "Featured Products" section on the user dashboard</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea id="description" rows={3} value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the product..."
                    className="w-full px-3 py-2 text-sm rounded-md border border-[#d4b896] bg-white text-[#2b1a12] resize-y" />
                </div>

                {/* Features */}
                <div>
                  <Label htmlFor="features">Features (one per line)</Label>
                  <textarea id="features" rows={4} value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder={"Multi-layered 3D design\nPremium birch plywood\nHand-finished with natural oils"}
                    className="w-full px-3 py-2 text-sm rounded-md border border-[#d4b896] bg-white text-[#2b1a12] resize-y" />
                </div>

                {/* Product Specifications */}
                <div>
                  <Label className="text-base font-semibold">Product Specifications</Label>
                  <p className="text-xs text-[#8b5a3c] mb-3">Default values are pre-filled. Edit any field as needed.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#fdf8f2] rounded-lg border border-[#e6dcd0]">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-[#5a3726]">{key}</label>
                        <Input
                          value={value}
                          onChange={(e) => updateSpec(key, e.target.value)}
                          className="h-8 text-sm bg-white border-[#d4b896]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Multi-Image Upload */}
                <div>
                  <Label>Product Images (up to 3)</Label>
                  <p className="text-xs text-[#8b5a3c] mb-2">Upload front view, detail view, and room mockup</p>
                  <div className="mt-2 flex items-start gap-4 flex-wrap">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#d4b896]">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                          {index === 0 ? 'Front' : index === 1 ? 'Detail' : 'Room'}
                        </span>
                      </div>
                    ))}
                    {imagePreviews.length < 3 && (
                      <label className="flex flex-col items-center justify-center w-24 h-24 bg-[#f7f1e8] border-2 border-dashed border-[#d4b896] rounded-lg cursor-pointer hover:bg-[#e6dcd0] transition-colors">
                        <Upload className="w-5 h-5 text-[#8b5a3c] mb-1" />
                        <span className="text-[10px] text-[#5a3726]">Add Image</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" multiple />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving}
                    className="bg-[#5a3726] hover:bg-[#3b2412] text-white gap-2">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingId ? 'Update Product' : 'Add Product'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}
                    className="border-[#d4b896] text-[#5a3726]">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <Card className="border-[#e6dcd0] shadow-md rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-[#f7f1e8] border-b border-[#e6dcd0] pb-4">
            <CardTitle className="font-serif text-[#2b1a12] text-xl">
              Products ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-[#8b5a3c]">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-[#8b5a3c]">
                <p className="text-lg mb-2">No products yet</p>
                <p className="text-sm">Click &quot;Add Product&quot; to add your first product!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border transition-shadow ${
                      product.is_active
                        ? 'border-[#e6dcd0] bg-[#fdfaf6] hover:shadow-sm'
                        : 'border-red-200 bg-red-50/50 opacity-70'
                    }`}>
                    {/* Image */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#e6dcd0] shrink-0">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#8b5a3c]">
                          No img
                        </div>
                      )}
                      {!product.is_active && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-red-700 bg-white/80 px-1 rounded">INACTIVE</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-[#2b1a12] truncate">{product.name}</h3>
                        {product.badge && (
                          <span className="text-xs bg-[#8b5a3c] text-white px-2 py-0.5 rounded-full">
                            {product.badge}
                          </span>
                        )}
                        {product.featured && (
                          <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                            ⭐ Featured
                          </span>
                        )}
                        {!product.is_active && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium border border-red-200">
                            Deleted
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#5a3726]">
                        ₹{product.price} · Stock: {product.stock} · {product.category} · {product.size === 'all' ? 'All Sizes' : MAP_SIZES.find(s => s.id === product.size.toLowerCase())?.label || product.size}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                      {product.is_active ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product)}
                            className="flex-1 sm:flex-initial border-[#d4b896] text-[#5a3726] gap-1 hover:bg-[#f7f1e8]">
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setSelectedProductForReviews(product)}
                            className="flex-1 sm:flex-initial border-[#8b5a3c] text-[#8b5a3c] gap-1 hover:bg-[#fffaf3]">
                            <Info className="w-3.5 h-3.5" /> Info
                          </Button>
                          <Button size="sm" onClick={() => handleDelete(product.id)}
                            className="flex-1 sm:flex-initial gap-1 bg-[#8b5a3c] hover:bg-[#6d4830] text-white font-medium shadow-sm">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => handleRestore(product.id)}
                            className="flex-1 sm:flex-initial gap-1 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm">
                            <Plus className="w-3.5 h-3.5" /> Restore
                          </Button>
                          <Button size="sm" onClick={() => handlePermanentDelete(product.id)}
                            className="flex-1 sm:flex-initial gap-1 bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm">
                            <Trash2 className="w-3.5 h-3.5" /> Perma-Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Review Insight Modal */}
      {selectedProductForReviews && (
        <ReviewInsightModal 
          product={selectedProductForReviews} 
          onClose={() => setSelectedProductForReviews(null)} 
        />
      )}
    </div>
  )
}
