"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Calendar, User, X } from 'lucide-react'

interface Blog {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  image: string
}

export default function AdminBlogPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: '1',
      title: 'The Art of Wooden Map Making',
      excerpt: 'Discover the intricate process behind creating our handcrafted wooden maps.',
      content: 'Full content here...',
      author: 'Admin',
      date: '2024-02-15',
      image: '/Home.jpeg'
    },
    {
      id: '2',
      title: 'Choosing the Perfect Wood for Your Map',
      excerpt: 'Learn about different wood types and how they affect the final product.',
      content: 'Full content here...',
      author: 'Admin',
      date: '2024-02-10',
      image: '/Custom.jpeg'
    }
  ])
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    image: ''
  })

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      window.location.href = '/login'
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingBlog) {
      setBlogs(blogs.map(blog =>
        blog.id === editingBlog.id
          ? { ...blog, ...formData, date: new Date().toISOString().split('T')[0] }
          : blog
      ))
    } else {
      const newBlog: Blog = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split('T')[0]
      }
      setBlogs([newBlog, ...blogs])
    }

    setFormData({ title: '', excerpt: '', content: '', author: 'Admin', image: '' })
    setEditingBlog(null)
    setShowForm(false)
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      image: blog.image
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
  }

  const handleCancel = () => {
    setFormData({ title: '', excerpt: '', content: '', author: 'Admin', image: '' })
    setEditingBlog(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-[#fffaf3]">
      <header className="bg-[#f7f1e8] shadow-sm sticky top-0 z-10 border-b border-[#e6dcd0]">
        <div className="px-4 lg:px-8 py-4">
          <h1 className="text-2xl font-serif font-medium text-[#2b1a12]">Manage Blog</h1>
          <p className="text-sm text-[#5a3726]">Create and manage blog posts</p>
        </div>
      </header>

      <main className="px-4 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#8b5a3c] hover:bg-[#6d4830] text-white"
          >
            {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {showForm ? 'Cancel' : 'Add New Blog Post'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 bg-[#f7f1e8] border-[#e6dcd0]">
            <CardHeader>
              <CardTitle className="text-[#2b1a12]">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-[#5a3726]">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-[#fffaf3] border-[#d4b896]"
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt" className="text-[#5a3726]">Excerpt</Label>
                  <Input
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    className="bg-[#fffaf3] border-[#d4b896]"
                  />
                </div>
                <div>
                  <Label htmlFor="content" className="text-[#5a3726]">Content</Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-3 py-2 bg-[#fffaf3] border border-[#d4b896] rounded-md"
                  />
                </div>
                <div>
                  <Label htmlFor="image" className="text-[#5a3726]">Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/image.jpg or upload"
                      className="bg-[#fffaf3] border-[#d4b896] flex-1"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <div className="px-4 py-2 bg-[#8b5a3c] hover:bg-[#6d4830] text-white rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                        Upload
                      </div>
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const url = URL.createObjectURL(file)
                            setFormData({ ...formData, image: url })
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formData.image && (
                    <div className="mt-3">
                      <p className="text-xs text-[#9b7b65] mb-2">Preview:</p>
                      <img src={formData.image} alt="Preview" className="h-32 w-auto rounded-md border border-[#d4b896]" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-[#8b5a3c] hover:bg-[#6d4830] text-white">
                    {editingBlog ? 'Update' : 'Create'} Blog Post
                  </Button>
                  <Button type="button" onClick={handleCancel} variant="outline" className="border-[#d4b896] text-[#5a3726]">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="bg-[#f7f1e8] border-[#e6dcd0] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-[#efe6d8] relative">
                {blog.image && (
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-serif text-lg font-medium text-[#2b1a12] mb-2">{blog.title}</h3>
                <p className="text-sm text-[#5a3726] mb-4 line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-[#9b7b65] mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {blog.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {blog.author}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(blog)}
                    className="flex-1 bg-[#8b5a3c] hover:bg-[#6d4830] text-white"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(blog.id)}
                    variant="outline"
                    className="border-[#d4b896] text-[#5a3726] hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {blogs.length === 0 && (
          <Card className="bg-[#f7f1e8] border-[#e6dcd0]">
            <CardContent className="p-12 text-center">
              <p className="text-[#5a3726]">No blog posts yet. Create your first one!</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
