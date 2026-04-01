'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 10 }}>Something went wrong</h2>
        <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 24 }}>{error.message}</p>
        <button onClick={reset}
          style={{ padding: '9px 20px', background: 'var(--amber)', color: '#0A0A0F', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          Try Again
        </button>
      </div>
    </div>
  )
}
