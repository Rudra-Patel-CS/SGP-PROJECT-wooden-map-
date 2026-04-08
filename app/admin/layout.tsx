import { AdminNav } from '@/components/admin-nav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      <AdminNav />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
        <main className="flex-1 w-full lg:pl-64">
          {children}
        </main>
      </div>
    </div>
  )
}
