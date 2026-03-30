'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      window.location.href = '/login'
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#fffaf3]">
      <header className="bg-[#f7f1e8] shadow-sm sticky top-0 z-10 border-b border-[#e6dcd0]">
        <div className="px-4 lg:px-8 py-4">
          <h1 className="text-2xl font-serif font-medium text-[#2b1a12]">Settings</h1>
          <p className="text-sm text-[#5a3726]">Configure admin panel settings</p>
        </div>
      </header>

      <main className="px-4 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Settings panel coming soon...</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
