'use client'
import { useEffect } from 'react'

interface AdSlotProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

export default function AdSlot({ slot, format = 'auto', className }: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_ID

  useEffect(() => {
    try {
      if (clientId && typeof window !== 'undefined') {
        ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
        ;(window as any).adsbygoogle.push({})
      }
    } catch {}
  }, [clientId])

  if (!clientId) {
    // Placeholder when AdSense not configured
    return (
      <div style={{
        background: 'var(--bg3)',
        border: '1px dashed var(--border2)',
        borderRadius: 8,
        padding: '20px',
        textAlign: 'center',
        fontSize: 11,
        color: 'var(--text2)',
        margin: '24px 0',
      }}>
        Ad slot — Add NEXT_PUBLIC_ADSENSE_ID to .env to enable AdSense
      </div>
    )
  }

  return (
    <div className={className} style={{ margin: '24px 0', textAlign: 'center', minHeight: 90 }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
