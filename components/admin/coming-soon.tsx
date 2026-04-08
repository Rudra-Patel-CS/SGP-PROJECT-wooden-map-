'use client'

import { motion } from 'framer-motion'
import { LucideIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AdminComingSoonProps {
  icon: LucideIcon
  title: string
  description: string
}

export function AdminComingSoon({ icon: Icon, title, description }: AdminComingSoonProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 bg-[#fffaf3]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#8b5a3c]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#8b5a3c]/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-lg text-center z-10"
      >
        {/* Icon Container */}
        <div className="relative inline-block mb-10">
          <div className="absolute inset-0 bg-[#8b5a3c]/10 rounded-[2.5rem] rotate-6 scale-110" />
          <div className="relative w-24 h-24 bg-white rounded-[2.5rem] border border-[#e6dcd0] shadow-xl flex items-center justify-center text-[#8b5a3c]">
            <Icon className="w-12 h-12" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2b1a12] tracking-tight">
            {title}
          </h1>
          <div className="h-1 w-20 bg-[#8b5a3c]/30 mx-auto rounded-full" />
          <p className="text-lg text-[#5a3726]/80 font-medium max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Progress Bar Mockup */}
        <div className="max-w-xs mx-auto mb-10">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#8b5a3c] mb-2 px-1">
            <span>Progress</span>
            <span>Coming Soon</span>
          </div>
          <div className="h-2 w-full bg-[#e6dcd0] rounded-full overflow-hidden p-[1px]">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "75%" }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-[#8b5a3c] to-[#d4b896] rounded-full"
            />
          </div>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/admin/dashboard">
            <Button className="bg-[#5a3726] hover:bg-[#3b2412] text-white px-8 h-12 rounded-full font-bold shadow-lg transition-all group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Subtle Tagline */}
        <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b5a3c]">
          Aryam Maps Portal · v1.0
        </p>
      </motion.div>
    </div>
  )
}
