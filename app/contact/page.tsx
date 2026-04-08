"use client";

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, ShieldCheck, Users, Calendar, Award, ExternalLink, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useSettings } from '@/components/settings-context'

export default function ContactPage() {
  const { settings } = useSettings();
  const contactPersons = [
    { name: "Kishan Patel", role: "Contact Person", phone: "85112 59588" },
    { name: "Bhumin Patel", role: "Owner", phone: "88661 36698" }
  ]

  const factsheet = [
    { icon: Award, label: "Nature of Business", value: "Manufacturer / Exporter / Supplier" },
    { icon: Users, label: "Total Employees", value: "21 - 50" },
    { icon: Calendar, label: "Established", value: "2019" },
    { icon: ShieldCheck, label: "Legal Status", value: "Individual (Sole proprietorship)" }
  ]

  const beyondMapsProducts = [
    { name: "Ayodhya Ram Mandir Model", url: "https://5.imimg.com/data5/SELLER/Default/2023/12/370548902/YW/SN/BW/62753935/ayodhya-ram-mandir-model-500x500.jpeg" },
    { name: "MDF Dry Fruit Box", url: "https://img2.exportersindia.com/product_images/bc-small/2022/2/9140895/mdf-dry-fruit-box-1644040645-6188290.jpeg" },
    { name: "Wooden Desktop Calendar", url: "https://img2.exportersindia.com/product_images/bc-small/2022/2/9140895/wooden-desktop-calendar-1644041256-6188328.jpeg" },
    { name: "Designer Wooden Wall Clock", url: "https://5.imimg.com/data5/SELLER/Default/2021/1/BO/WW/IV/62753935/designer-wooden-wall-clock-500x500.jpg" },
    { name: "Corporate Pen Stand", url: "https://5.imimg.com/data5/SELLER/Default/2021/1/EC/NQ/WF/62753935/corporate-pen-stand-500x500.jpg" },
    { name: "Wooden Diary", url: "https://img2.exportersindia.com/product_images/bc-small/2022/2/9140895/wooden-diary-1644041309-6188330.jpeg" },
    { name: "Laser Cut Tea Coaster", url: "https://img2.exportersindia.com/product_images/bc-small/2022/2/9140895/laser-cut-tea-coaster-1644040814-6188295.jpeg" },
    { name: "MDF Storage Box", url: "https://img2.exportersindia.com/product_images/bc-small/2022/2/9140895/mdf-storage-box-1644040745-6188293.jpeg" },
    { name: "Wooden Spice Box", url: "https://img2.exportersindia.com/product_images/bc-small/2022/2/9140895/wooden-spice-box-1644041206-6188324.jpeg" },
    { name: "Heart Shape Box", url: "https://5.imimg.com/data5/SELLER/Default/2021/1/KR/EU/UV/62753935/heart-shape-box-500x500.JPG" },
    { name: "Wooden Partition Box", url: "https://img2.exportersindia.com/product_images/bc-small/2022/2/9140895/wooden-partition-box-1644041155-6188319.jpeg" },
    { name: "Corporate Gift Box", url: "https://5.imimg.com/data5/GLADMIN/Default/2023/4/303245147/AE/AI/TT/62753935/corporate-gift-box-500x500.png" }
  ]

  return (
    <div className="min-h-screen bg-[#fffaf3] flex flex-col pt-16">
      <Header />
      
      <main className="flex-1">
        {/* --- HERO SECTION --- (Clean Solid Design) */}
        <section className="relative h-[25vh] min-h-[220px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f7f1e8] via-[#fffaf3] to-[#f3ebe2] border-b border-[#e6dcd0]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #8b5a3c 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          
          <div className="relative z-20 text-center px-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold text-[#2b1a12] mb-3"
            >
              Contact Us
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="h-1.5 w-20 bg-[#8b5a3c]/40 mx-auto rounded-full"
            />
            <p className="mt-4 text-[#8b5a3c] text-sm font-medium uppercase tracking-[0.2em]">{settings.store_name} Global Operations</p>
          </div>
        </section>

        {/* --- CONTACT & INFO GRID --- */}
        <section className="py-20 px-6 lg:px-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left: Reach Us & Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#2b1a12] mb-8 relative after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-12 after:bg-[#8b5a3c]">
                  Reach Us
                </h2>
                
                <div className="space-y-8">
                  {/* Location */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#8b5a3c]/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-[#8b5a3c]" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-[#2b1a12] mb-1">Visit Our Factory</h3>
                      <p className="text-[#5a3726] leading-relaxed max-w-sm">
                        Plot No-11, Mahalakshmi Industrial Estate, Near Raj Granite, Main Road, Ahmedabad, Gujarat - 382481
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#8b5a3c]/10 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-[#8b5a3c]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-[#2b1a12] mb-3">Call Our Team</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {contactPersons.map((p) => (
                          <div key={p.name} className="p-3 rounded-xl bg-white border border-[#e6dcd0] shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b5a3c] mb-1">{p.role}</p>
                            <p className="font-bold text-[#2b1a12] text-sm">{p.name}</p>
                            <a href={`tel:${p.phone.replace(/\s+/g, '')}`} className="text-[#8b5a3c] hover:underline font-mono text-sm">
                              {p.phone}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Email & Hours */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#8b5a3c]/10 flex items-center justify-center shrink-0">
                        <Mail className="w-6 h-6 text-[#8b5a3c]" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-[#2b1a12] mb-1">Email Us</h3>
                        <a href={`mailto:${settings.support_email}`} className="text-[#5a3726] hover:text-[#8b5a3c] transition">
                          {settings.support_email}
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#8b5a3c]/10 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-[#8b5a3c]" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-[#2b1a12] mb-1">Working Hours</h3>
                        <p className="text-[#5a3726] text-sm leading-snug">Mon-Sat: 8:00 AM - 8:00 PM<br/>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Factsheet */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#8b5a3c] to-[#5a3726] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
                <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#d4b896]" />
                  Company Quick Facts
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {factsheet.map((f) => (
                    <div key={f.label}>
                      <p className="text-[#d4b896] text-[10px] font-bold uppercase tracking-wider mb-1">{f.label}</p>
                      <p className="text-sm font-medium">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Map & Form */}
            <div className="space-y-12">
              {/* Google Maps Integration */}
              <div className="rounded-3xl border border-[#e6dcd0] overflow-hidden shadow-xl bg-white p-4">
                <div className="relative h-[300px] rounded-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-[#f3ebe2] flex flex-col items-center justify-center text-center p-6 transition-all duration-700 group-hover:scale-105">
                    <MapPin className="w-12 h-12 text-[#8b5a3c] mb-4 animate-bounce" />
                    <h3 className="font-serif font-bold text-xl text-[#2b1a12] mb-2">Find Us in Ahmedabad</h3>
                    <p className="text-sm text-[#5a3726] mb-6">{settings.store_name} is located near Chhatral GIDC Phase 2.</p>
                    <a 
                      href="https://www.google.com/maps/place/Aryam+Creation/data=!4m2!3m1!1s0x0:0x45193be951ee5bd3?sa=X&ved=1t:2428&ictx=111" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#8b5a3c] hover:bg-[#6d4830] text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition shadow-md"
                    >
                      Open GPS Location <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  {/* Decorative map border overlay */}
                  <div className="absolute inset-0 border-[12px] border-white/5 pointer-events-none" />
                </div>
              </div>

              {/* Message Us Card */}
              <div className="p-10 rounded-3xl border border-[#e6dcd0] bg-white shadow-xl relative">
                <h2 className="text-2xl font-serif font-bold text-[#2b1a12] mb-8">Send Us a Message</h2>
                <form className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8b5a3c] uppercase ml-1">Your Name</label>
                      <input type="text" placeholder="John Doe" className="w-full h-11 px-4 rounded-xl border border-[#e6dcd0] bg-[#fffaf3] text-sm focus:outline-none focus:ring-1 focus:ring-[#8b5a3c]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8b5a3c] uppercase ml-1">Email</label>
                      <input type="email" placeholder="john@example.com" className="w-full h-11 px-4 rounded-xl border border-[#e6dcd0] bg-[#fffaf3] text-sm focus:outline-none focus:ring-1 focus:ring-[#8b5a3c]" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8b5a3c] uppercase ml-1">Message</label>
                    <textarea rows={4} placeholder="How can we help you?" className="w-full p-4 rounded-xl border border-[#e6dcd0] bg-[#fffaf3] text-sm focus:outline-none focus:ring-1 focus:ring-[#8b5a3c] resize-none" />
                  </div>
                  <Button className="w-full bg-[#5a3726] hover:bg-[#3b2412] text-white font-bold h-12 rounded-xl text-lg shadow-lg">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </section>

        {/* --- ABOUT ARYAM CREATION --- */}
        <section className="bg-[#f3ebe2] py-24 pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-center">
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="bg-white p-10 rounded-[3rem] shadow-xl border border-[#e6dcd0] text-center"
                >
                  <div className="w-20 h-20 bg-[#8b5a3c] rounded-[1.5rem] flex items-center justify-center text-white font-serif font-black text-4xl mx-auto mb-6 shadow-inner">
                    A
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#2b1a12] mb-2 leading-none">{settings.store_name}</h3>
                  <p className="text-[#8b5a3c] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 italic">Est. 2019</p>
                  <p className="text-sm text-[#5a3726] leading-relaxed">
                    "High-quality manufacturer and exporter of elite wooden products."
                  </p>
                </motion.div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-bold text-[#2b1a12] mb-6">About Our Journey</h2>
                <div className="prose prose-brown max-w-none text-[#5a3726] space-y-4">
                  <p className="leading-relaxed">
                    Established in the year **2019** at Ahmedabad, Gujarat (India), we at **{settings.store_name}** are a highly renowned Manufacturer, Wholesaler, and Exporter of the best quality products. Our portfolio includes elite MDF Dry Fruit Boxes, Laser Cut Tea Coasters, Wooden Desktop Calendars, and much more.
                  </p>
                  <p className="leading-relaxed">
                    Our products are designed in strict compliance with industry-specified quality standards at our avant-garde infrastructure facility. These are properly tested by an experienced team of professionals to make sure flawless and flaw-free quality.
                  </p>
                  <p className="leading-relaxed italic font-medium text-[#8b5a3c]">
                    "Under the efficient leadership of Mr. Nikita Ben Patel, we have established our trustworthy position in the market through our client-friendly and quality-oriented business management."
                  </p>
                </div>
                
                <div className="pt-6 border-t border-[#d4b896]/30">
                  <p className="text-[11px] font-bold tracking-[0.25em] text-[#8b5a3c]/70 uppercase">
                    Your Imagination is Our Responsibility
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- BEYOND MAPS: PRODUCT MARQUEE --- */}
        <section className="bg-white py-16 border-t border-[#e6dcd0] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#2b1a12] mb-2">Beyond Maps</h2>
              <p className="text-[#8b5a3c] font-medium italic">Discover our full craftsmanship catalog</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9b7b65]">Auto-Running Showcase</p>
            </div>
          </div>

          <div className="relative">
            {/* Left/Right Gradients for smooth fade */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

            <motion.div 
              className="flex gap-8 items-center"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 40, ease: "linear", repeat: Infinity }}
              style={{ width: "fit-content" }}
            >
              {[...beyondMapsProducts, ...beyondMapsProducts].map((p, i) => (
                <div key={i} className="flex-shrink-0 group">
                  <div className="w-64 h-64 rounded-3xl overflow-hidden border border-[#e6dcd0] bg-[#fffaf3] transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 relative">
                    <img 
                      src={p.url} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-white font-bold text-sm leading-tight">{p.name}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-xs font-bold text-[#5a3726] uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                    {p.name}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
