import { AdminNav } from '@/components/admin-nav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <AdminNav />
      <main className="flex-1 w-full lg:pl-64">
        {children}
      </main>
    </div>
  )
}
