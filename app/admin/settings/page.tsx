'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Globe, 
  ShieldCheck, 
  LogOut, 
  Save, 
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '@/components/settings-context'

export default function SettingsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const { settings: globalSettings, refreshSettings } = useSettings()

  // Form states
  const [formData, setFormData] = useState({
    id: '',
    storeName: 'Aryam Maps',
    supportEmail: 'support@aryammaps.com',
    adminEmail: 'admin@aryammaps.com',
    adminName: 'Admin',
    currency: 'INR',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    twoFactorVerified: false
  })

  const [qrCodeData, setQrCodeData] = useState<{qrCodeUrl: string, secret: string} | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying2FA, setIsVerifying2FA] = useState(false)
  const [isConfirming2FA, setIsConfirming2FA] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/login')
      return
    }

    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/settings', {
          headers: { 'x-admin-auth': 'true' }
        })
        if (res.ok) {
          const data = await res.json()
          setFormData(prev => ({
            ...prev,
            id: data.id,
            storeName: data.store_name,
            supportEmail: data.support_email,
            adminEmail: data.admin_email || 'admin@aryammaps.com',
            currency: data.currency,
            twoFactorEnabled: data.two_factor_enabled,
            twoFactorVerified: data.two_factor_enabled
          }))
        }
      } catch (err) {
        console.error('Failed to fetch config:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminEmail')
    window.location.href = '/login'
  }

  const handleSave = async () => {
    // Password validation logic if fields are filled
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.newPassword) {
        setError('Please enter a new password')
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match')
        return
      }
      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
    }

    setIsSaving(true)
    setError('')
    
    try {
      // Build payload - only include password if user actually typed one
      const payload: any = {
        store_name: formData.storeName,
        support_email: formData.supportEmail,
        admin_email: formData.adminEmail,
        currency: formData.currency,
        two_factor_enabled: formData.twoFactorEnabled
      }
      if (formData.newPassword && formData.newPassword.trim() !== '') {
        payload.admin_password = formData.newPassword
      }

      console.log('[Settings] Saving payload:', JSON.stringify(payload))

      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-auth': 'true'
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setShowToast(true)
        await refreshSettings() // Sync global state
        setTimeout(() => setShowToast(false), 3000)
        // Clear password fields after success
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to update settings')
      }
    } catch (err) {
      setError('A network error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  if (!mounted || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="animate-pulse text-[#8b5a3c]">Initializing Secure Environment...</div>
    </div>
  )

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Globe },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'account', label: 'Account', icon: User },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: 'easeOut' as any } 
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: '#FDFBF7' }}>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(139,90,60,0.1)', color: '#8b5a3c' }}>
              <Settings className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold" style={{ color: '#1E2430' }}>Admin Portal Settings</h1>
              <p className="text-sm" style={{ color: '#6E6B5E' }}>Configure your enterprise workspace and security preferences</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
            style={{ background: '#8b5a3c' }}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-72 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 text-sm font-bold ${
                  activeTab === tab.id 
                    ? 'shadow-md border' 
                    : 'hover:bg-white/50 text-[#6E6B5E]'
                }`}
                style={activeTab === tab.id ? {
                  background: '#FFFFFF',
                  borderColor: 'rgba(139,90,60,0.2)',
                  color: '#8b5a3c'
                } : {}}
              >
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-[#8b5a3c]' : 'text-[#6E6B5E]'}`} />
                <span>{tab.label}</span>
                {activeTab === tab.id && <ChevronRight className="ml-auto h-4 w-4" />}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 border shadow-sm"
                style={{ borderColor: 'rgba(139,90,60,0.15)' }}
              >
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1E2430' }}>
                      <Globe className="h-5 w-5 text-[#8b5a3c]" />
                      Global Platform Configuration
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8b5a3c' }}>Store Primary Identity</label>
                        <input 
                          type="text" 
                          value={formData.storeName}
                          onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#8b5a3c]/20 outline-none transition-all font-medium"
                          style={{ borderColor: 'rgba(139,90,60,0.2)', background: '#FDFBF7' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8b5a3c' }}>Enterprise Support Email</label>
                        <input 
                          type="email" 
                          value={formData.supportEmail}
                          onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#8b5a3c]/20 outline-none transition-all font-medium"
                          style={{ borderColor: 'rgba(139,90,60,0.2)', background: '#FDFBF7' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8b5a3c' }}>Operating Currency</label>
                        <select 
                          value={formData.currency}
                          onChange={(e) => setFormData({...formData, currency: e.target.value})}
                          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#8b5a3c]/20 outline-none transition-all font-medium"
                          style={{ borderColor: 'rgba(139,90,60,0.2)', background: '#FDFBF7' }}
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-4">
                      <Info className="h-5 w-5 text-amber-600 shrink-0" />
                      <p className="text-sm text-amber-800 leading-relaxed">
                        These settings impact how your customers perceive the brand. Changes to currency will update all product displays across the application.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1E2430' }}>
                      <Lock className="h-5 w-5 text-[#8b5a3c]" />
                      Access & Security Shield
                    </h2>
                    
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8b5a3c' }}>Current Master Password</label>
                        <input 
                          type="password" 
                          placeholder="Enter your current password"
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                          autoComplete="new-password"
                          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#8b5a3c]/20 outline-none transition-all"
                          style={{ borderColor: 'rgba(139,90,60,0.2)', background: '#FDFBF7' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8b5a3c' }}>New Vault Password</label>
                        <input 
                          type="password" 
                          placeholder="At least 6 characters"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                          autoComplete="new-password"
                          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#8b5a3c]/20 outline-none transition-all"
                          style={{ borderColor: 'rgba(139,90,60,0.2)', background: '#FDFBF7' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8b5a3c' }}>Confirm Authorization Key</label>
                        <input 
                          type="password" 
                          placeholder="Repeat new password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          autoComplete="new-password"
                          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#8b5a3c]/20 outline-none transition-all"
                          style={{ borderColor: 'rgba(139,90,60,0.2)', background: '#FDFBF7' }}
                        />
                      </div>
                      
                      {error && (
                        <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded border border-red-100">{error}</p>
                      )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2430' }}>Multi-Factor Authentication</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                              <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">Two-Step Verification</p>
                              <p className="text-[10px] text-slate-500 font-medium">Add an extra layer of security to your account</p>
                            </div>
                          </div>
                          <div 
                            onClick={async () => {
                              const newStatus = !formData.twoFactorEnabled;
                              if (newStatus && !formData.twoFactorVerified) {
                                setIsConfirming2FA(true);
                              } else if (!newStatus) {
                                if (confirm('Are you sure you want to disable 2FA? This will reduce your account security.')) {
                                  try {
                                    const res = await fetch('/api/admin/2fa', { 
                                      method: 'DELETE',
                                      headers: { 'x-admin-auth': 'true' }
                                    });
                                    if (res.ok) {
                                      setFormData({...formData, twoFactorEnabled: false, twoFactorVerified: false});
                                      setQrCodeData(null);
                                    }
                                  } catch (err) {
                                    setError('Failed to disable 2FA');
                                  }
                                }
                              } else {
                                setFormData({...formData, twoFactorEnabled: newStatus});
                              }
                            }}
                            className="relative inline-flex items-center cursor-pointer"
                          >
                            <div className={`w-11 h-6 rounded-full transition-colors ${formData.twoFactorEnabled ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.twoFactorEnabled ? 'translate-x-5' : ''}`}></div>
                          </div>
                        </div>

                        {/* 2FA Setup Flow */}
                        <AnimatePresence>
                          {isConfirming2FA && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="p-6 rounded-xl border border-amber-100 bg-amber-50/30 space-y-4"
                              key="confirm-2fa"
                            >
                              <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Verify Identity to Enable 2FA</label>
                                <div className="flex gap-2">
                                  <input 
                                    type="password" 
                                    placeholder="Enter Master Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="flex-1 p-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium"
                                  />
                                  <button
                                    onClick={async () => {
                                      try {
                                        const res = await fetch('/api/admin/2fa', {
                                          headers: { 
                                            'x-admin-auth': 'true',
                                            'x-admin-password': confirmPassword
                                          }
                                        });
                                        if (res.ok) {
                                          const data = await res.json();
                                          setQrCodeData(data);
                                          setFormData({...formData, twoFactorEnabled: true});
                                          setIsConfirming2FA(false);
                                          setConfirmPassword('');
                                        } else {
                                          setError('Invalid password for 2FA authorization');
                                        }
                                      } catch {
                                        setError('Identity verification failed');
                                      }
                                    }}
                                    className="px-6 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors"
                                  >
                                    Authorize
                                  </button>
                                </div>
                                <p className="text-[10px] text-amber-600 font-medium">Authorization required: Identity verification needed to modify security protocols.</p>
                              </div>
                            </motion.div>
                          )}

                          {formData.twoFactorEnabled && !formData.twoFactorVerified && qrCodeData && !isConfirming2FA && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="p-6 rounded-xl border border-blue-100 bg-blue-50/30 space-y-4"
                              key="setup-2fa"
                            >
                              <div className="flex flex-col items-center text-center">
                                <p className="text-sm font-bold text-blue-900 mb-2">Scan QR Code</p>
                                <p className="text-xs text-blue-700 mb-4">Open your authenticator app and scan this code to link your account.</p>
                                <div className="p-4 bg-white rounded-xl shadow-inner border border-blue-100 mb-4">
                                  <img src={qrCodeData.qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                                </div>
                                <div className="mb-6 w-full p-3 rounded-lg border border-blue-100 bg-white/50 text-center">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-1">Manual Setup Key</p>
                                  <code className="text-sm font-mono font-bold text-blue-600 break-all select-all cursor-pointer" title="Click to select all">
                                    {qrCodeData.secret}
                                  </code>
                                  <p className="text-[9px] text-blue-500 mt-1">If your scanner fails, enter this code manually into your app.</p>
                                </div>
                                <div className="w-full space-y-3 text-left">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Enter 6-digit Verification Code</label>
                                  <div className="flex gap-2">
                                    <input 
                                      type="text" 
                                      maxLength={6}
                                      placeholder="000000"
                                      value={verificationCode}
                                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                      className="flex-1 p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500/20 outline-none text-center font-mono text-xl tracking-[0.5em]"
                                    />
                                    <button
                                      onClick={async () => {
                                        if (verificationCode.length !== 6) return;
                                        setIsVerifying2FA(true);
                                        try {
                                          const res = await fetch('/api/admin/2fa', {
                                            method: 'POST',
                                            headers: { 
                                              'Content-Type': 'application/json',
                                              'x-admin-auth': 'true'
                                            },
                                            body: JSON.stringify({ code: verificationCode })
                                          });
                                          if (res.ok) {
                                            setFormData({...formData, twoFactorVerified: true});
                                            setShowToast(true);
                                            setTimeout(() => setShowToast(false), 3000);
                                          } else {
                                            const data = await res.json();
                                            setError(data.error || 'Invalid code');
                                          }
                                        } catch {
                                          setError('Verification failed');
                                        } finally {
                                          setIsVerifying2FA(false);
                                        }
                                      }}
                                      disabled={isVerifying2FA || verificationCode.length !== 6}
                                      className="px-6 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                      {isVerifying2FA ? '...' : 'Verify'}
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-blue-600 font-medium">Verify your first code to complete the setup.</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {formData.twoFactorEnabled && formData.twoFactorVerified && (
                          <div className="p-4 rounded-xl border border-green-100 bg-green-50/50 flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <p className="text-xs text-green-800 font-bold">2FA is active and protecting your account.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'account' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1E2430' }}>
                        <User className="h-5 w-5 text-[#8b5a3c]" />
                        Professional Profile
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8b5a3c' }}>Full Display Name</label>
                          <input 
                            type="text" 
                            value={formData.adminName}
                            onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#8b5a3c]/20 outline-none transition-all font-medium"
                            style={{ borderColor: 'rgba(139,90,60,0.2)', background: '#FDFBF7' }}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8b5a3c' }}>Master Account Email (Login)</label>
                          <input 
                            type="email" 
                            value={formData.adminEmail}
                            onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#8b5a3c]/20 outline-none transition-all font-medium"
                            style={{ borderColor: 'rgba(139,90,60,0.2)', background: '#FDFBF7' }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-6 p-6 rounded-2xl border bg-[#FDFBF7]" style={{ borderColor: 'rgba(139,90,60,0.15)' }}>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-serif font-bold shadow-inner" style={{ background: '#8b5a3c', color: '#FFFFFF' }}>
                          A
                        </div>
                        <div>
                          <p className="text-2xl font-bold" style={{ color: '#1E2430' }}>{formData.adminName}</p>
                          <p className="text-sm font-semibold" style={{ color: '#8b5a3c' }}>Platform Superior</p>
                          <p className="text-xs mt-1" style={{ color: '#6E6B5E' }}>Last login: {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#1E2430' }}>System Exit</h3>
                      <div className="p-6 rounded-2xl border border-red-100 bg-red-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-red-900">Terminate Active Session</p>
                          <p className="text-xs text-red-700 font-medium">Log out from the administrative dashboard securely.</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-red-600 text-white font-bold transition-all hover:bg-red-700 active:scale-95 shadow-md shadow-red-600/20"
                        >
                          <LogOut className="h-5 w-5" />
                          Logout Now
                        </button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Aryam Maps Portal • Version 2.1.0 • Stable Build</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-10 right-10 flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border shadow-2xl z-50 overflow-hidden"
              style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500" />
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Synchronization Success</p>
                <p className="text-[10px] font-medium text-slate-500">System configuration updated successfully.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139,90,60,0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
