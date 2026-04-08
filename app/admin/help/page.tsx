'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HelpCircle } from 'lucide-react'
import { AdminComingSoon } from '@/components/admin/coming-soon'

export default function HelpPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/login')
    }
  }, [router])

  if (!mounted) return null

  return (
    <AdminComingSoon 
      icon={HelpCircle} 
      title="Help Center" 
      description="Access documentation, tutorials, and support to master your map portal's management."
    />
  )
}
