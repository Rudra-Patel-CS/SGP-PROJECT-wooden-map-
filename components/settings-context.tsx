'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface Settings {
  store_name: string
  support_email: string
  currency: string
}

interface SettingsContextType {
  settings: Settings
  loading: boolean
  refreshSettings: () => Promise<void>
}

const defaultSettings: Settings = {
  store_name: 'Aryam Maps',
  support_email: 'support@aryammaps.com',
  currency: 'INR'
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {}
})

export const useSettings = () => useContext(SettingsContext)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
