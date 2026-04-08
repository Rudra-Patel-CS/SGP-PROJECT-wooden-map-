"use client";

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Plus, Edit, Trash2, Calendar, User, X, Loader2,
  ImageIcon, Video, Eye, EyeOff, Upload, FileText, ChevronRight, AlertCircle
} from 'lucide-react'

interface Blog {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  created_at: string
  image_url: string
  video_url?: string
  published?: boolean
  slug: string
}

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  author: 'Admin',
  image_url: '',
  video_url: '',
  published: true,
}

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [formData, setFormData] = useState({ ...emptyForm })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit')
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) window.location.href = '/login'
    else fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/blogs')
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to fetch blogs')
      }
      setBlogs(await res.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditingBlog(null)
    setFormData({ ...emptyForm })
    setPreviewTab('edit')
    setUploadError('')
    setPanelOpen(true)
  }

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      author: blog.author || 'Admin',
      image_url: blog.image_url || '',
      video_url: blog.video_url || '',
      published: blog.published !== false,
    })
    setPreviewTab('edit')
    setUploadError('')
    setPanelOpen(true)
  }

  const closePanel = () => {
    setPanelOpen(false)
    setEditingBlog(null)
    setFormData({ ...emptyForm })
    setUploadError('')
  }

  const handleUpload = async (file: File, type: 'image' | 'video') => {
    const setter = type === 'image' ? setUploadingImage : setUploadingVideo
    setter(true)
    setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/blogs/upload', {
        method: 'POST',
        headers: { 'x-admin-auth': 'true' },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      if (type === 'image') setFormData(f => ({ ...f, image_url: data.url }))
      else setFormData(f => ({ ...f, video_url: data.url }))
    } catch (err: any) {
      setUploadError(err.message)
    } finally {
      setter(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs'
      const method = editingBlog ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save blog')
      await fetchBlogs()
      closePanel()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
      if (res.ok) setBlogs(b => b.filter(x => x.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''

  return (
    <div className="min-h-screen bg-[#fffaf3]">
      {/* Header */}
      <header className="bg-[#f7f1e8] shadow-sm sticky top-0 z-10 border-b border-[#e6dcd0]">
        <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-[#2b1a12]">Manage Blog</h1>
            <p className="text-sm text-[#9b7b65]">{blogs.length} post{blogs.length !== 1 ? 's' : ''} total</p>
          </div>
          <Button onClick={openAdd} className="bg-[#8b5a3c] hover:bg-[#6d4830] text-white gap-2">
            <Plus className="h-4 w-4" /> New Post
          </Button>
        </div>
      </header>

      <main className="px-4 lg:px-8 py-8">
        {/* Global error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-auto"><X className="h-4 w-4" /></button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#8b5a3c] mr-3" />
            <span className="text-lg text-[#2b1a12]">Loading posts...</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-16 h-16 text-[#d4b896] mb-4" />
            <h3 className="text-xl font-serif text-[#2b1a12] mb-2">No posts yet</h3>
            <p className="text-[#9b7b65] mb-6">Create your first blog post to get started.</p>
            <Button onClick={openAdd} className="bg-[#8b5a3c] hover:bg-[#6d4830] text-white gap-2">
              <Plus className="h-4 w-4" /> Create First Post
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <div key={blog.id} className="group bg-white rounded-2xl border border-[#e6dcd0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Media */}
                <div className="relative aspect-[16/10] bg-[#efe6d8] overflow-hidden">
                  {(() => {
                    const isVideo = (url: string) => url && /\.(mp4|webm|ogg)$/i.test(url);
                    if (blog.video_url || isVideo(blog.image_url)) {
                      return <video src={blog.video_url || blog.image_url} className="w-full h-full object-cover" muted loop playsInline />;
                    } else if (blog.image_url) {
                      return <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />;
                    } else {
                      return (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#c4a882]">
                          <ImageIcon className="w-10 h-10 mb-2" />
                          <span className="text-sm">No media</span>
                        </div>
                      );
                    }
                  })()}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${blog.published !== false ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {blog.published !== false ? 'Published' : 'Draft'}
                  </div>
                  {(blog.video_url || (blog.image_url && /\.(mp4|webm|ogg)$/i.test(blog.image_url))) && (
                    <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Video className="w-3 h-3" /> Video
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-[#2b1a12] mb-1 line-clamp-2 leading-snug">{blog.title}</h3>
                  <p className="text-sm text-[#9b7b65] line-clamp-2 mb-4">{blog.excerpt || 'No excerpt'}</p>
                  <div className="flex items-center gap-3 text-xs text-[#b89a7a] mb-4">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{fmt(blog.created_at)}</span>
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{blog.author}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => openEdit(blog)} className="flex-1 bg-[#8b5a3c] hover:bg-[#6d4830] text-white text-xs h-8">
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" onClick={() => handleDelete(blog.id)} variant="outline" className="border-[#e6dcd0] text-[#9b7b65] hover:bg-red-50 hover:text-red-600 hover:border-red-300 text-xs h-8">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Slide-in Panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={closePanel} />
          <div className="w-full max-w-2xl bg-[#fffaf3] h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Panel Header */}
            <div className="sticky top-0 bg-[#f7f1e8] border-b border-[#e6dcd0] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-serif font-semibold text-[#2b1a12]">
                  {editingBlog ? 'Edit Post' : 'New Blog Post'}
                </h2>
                <p className="text-xs text-[#9b7b65] mt-0.5">Fill in the details below</p>
              </div>
              <button onClick={closePanel} className="p-2 rounded-full hover:bg-[#e6dcd0] text-[#5a3726] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Panel error */}
            {error && (
              <div className="mx-6 mt-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6">
              {/* Title */}
              <div className="space-y-1.5">
                <Label className="text-[#5a3726] font-medium text-sm">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                  required
                  placeholder="Enter blog title..."
                  className="bg-white border-[#d4b896] focus:border-[#8b5a3c] text-[#2b1a12] h-11"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <Label className="text-[#5a3726] font-medium text-sm">Excerpt / Summary *</Label>
                <textarea
                  value={formData.excerpt}
                  onChange={e => setFormData(f => ({ ...f, excerpt: e.target.value }))}
                  required
                  rows={2}
                  placeholder="Short description shown on blog listing..."
                  className="w-full px-3 py-2.5 bg-white border border-[#d4b896] rounded-md text-sm text-[#2b1a12] focus:outline-none focus:border-[#8b5a3c] resize-none"
                />
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[#5a3726] font-medium text-sm">Content *</Label>
                  <div className="flex rounded-lg overflow-hidden border border-[#d4b896]">
                    <button type="button" onClick={() => setPreviewTab('edit')}
                      className={`px-3 py-1 text-xs font-medium transition-colors ${previewTab === 'edit' ? 'bg-[#8b5a3c] text-white' : 'bg-white text-[#5a3726] hover:bg-[#f7f1e8]'}`}>
                      Write
                    </button>
                    <button type="button" onClick={() => setPreviewTab('preview')}
                      className={`px-3 py-1 text-xs font-medium transition-colors ${previewTab === 'preview' ? 'bg-[#8b5a3c] text-white' : 'bg-white text-[#5a3726] hover:bg-[#f7f1e8]'}`}>
                      Preview
                    </button>
                  </div>
                </div>
                {previewTab === 'edit' ? (
                  <textarea
                    value={formData.content}
                    onChange={e => setFormData(f => ({ ...f, content: e.target.value }))}
                    required
                    rows={12}
                    placeholder="Write your blog content here..."
                    className="w-full px-3 py-2.5 bg-white border border-[#d4b896] rounded-md text-sm text-[#2b1a12] focus:outline-none focus:border-[#8b5a3c] resize-y font-mono"
                  />
                ) : (
                  <div className="min-h-[200px] bg-white border border-[#d4b896] rounded-md p-4 text-sm text-[#5a3726] leading-relaxed">
                    {formData.content
                      ? formData.content.split('\n').map((p, i) =>
                          p.trim() ? <p key={i} className="mb-3">{p}</p> : <br key={i} />
                        )
                      : <span className="text-[#c4a882] italic">Nothing to preview yet...</span>}
                  </div>
                )}
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label className="text-[#5a3726] font-medium text-sm flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Cover Image
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.image_url}
                    onChange={e => setFormData(f => ({ ...f, image_url: e.target.value }))}
                    placeholder="Paste image URL or click upload..."
                    className="bg-white border-[#d4b896] focus:border-[#8b5a3c] text-[#2b1a12] flex-1 text-xs"
                  />
                  <Button type="button" variant="outline" className="border-[#d4b896] text-[#5a3726] shrink-0 gap-1.5"
                    onClick={() => imageInputRef.current?.click()} disabled={uploadingImage}>
                    {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4" /> Upload</>}
                  </Button>
                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], 'image'); e.target.value = '' }} />
                </div>
                {formData.image_url && (
                  <div className="relative rounded-xl overflow-hidden border border-[#e6dcd0] bg-[#efe6d8]" style={{ aspectRatio: '16/9' }}>
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    <button type="button" onClick={() => setFormData(f => ({ ...f, image_url: '' }))}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Video */}
              <div className="space-y-2">
                <Label className="text-[#5a3726] font-medium text-sm flex items-center gap-2">
                  <Video className="h-4 w-4" /> Video (optional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.video_url}
                    onChange={e => setFormData(f => ({ ...f, video_url: e.target.value }))}
                    placeholder="Paste video URL or click upload..."
                    className="bg-white border-[#d4b896] focus:border-[#8b5a3c] text-[#2b1a12] flex-1 text-xs"
                  />
                  <Button type="button" variant="outline" className="border-[#d4b896] text-[#5a3726] shrink-0 gap-1.5"
                    onClick={() => videoInputRef.current?.click()} disabled={uploadingVideo}>
                    {uploadingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4" /> Upload</>}
                  </Button>
                  <input ref={videoInputRef} type="file" accept="video/*" className="hidden"
                    onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], 'video'); e.target.value = '' }} />
                </div>
                {formData.video_url && (
                  <div className="relative rounded-xl overflow-hidden border border-[#e6dcd0] bg-black" style={{ aspectRatio: '16/9' }}>
                    <video src={formData.video_url} className="w-full h-full object-contain" controls />
                    <button type="button" onClick={() => setFormData(f => ({ ...f, video_url: '' }))}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {uploadError && (
                  <p className="text-xs text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" /> {uploadError}
                  </p>
                )}
              </div>

              {/* Author + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[#5a3726] font-medium text-sm">Author</Label>
                  <Input
                    value={formData.author}
                    onChange={e => setFormData(f => ({ ...f, author: e.target.value }))}
                    className="bg-white border-[#d4b896] focus:border-[#8b5a3c] text-[#2b1a12]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#5a3726] font-medium text-sm">Status</Label>
                  <button type="button"
                    onClick={() => setFormData(f => ({ ...f, published: !f.published }))}
                    className={`w-full h-10 rounded-md border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${formData.published ? 'bg-green-50 border-green-300 text-green-700' : 'bg-amber-50 border-amber-300 text-amber-700'}`}>
                    {formData.published ? <><Eye className="h-4 w-4" /> Published</> : <><EyeOff className="h-4 w-4" /> Draft</>}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2 pb-6">
                <Button type="submit" disabled={saving} className="flex-1 bg-[#8b5a3c] hover:bg-[#6d4830] text-white h-11 text-sm font-medium">
                  {saving
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    : <>{editingBlog ? 'Update Post' : 'Publish Post'} <ChevronRight className="ml-1 h-4 w-4" /></>}
                </Button>
                <Button type="button" onClick={closePanel} disabled={saving} variant="outline" className="border-[#d4b896] text-[#5a3726] h-11 px-6">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
