'use client'

import { useState } from 'react'

export default function SubscribeForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const email = e.target.email.value

    setLoading(true)

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      e.target.reset()
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto' }}
    >
      <input
        name="email"
        type="email"
        placeholder="your@email.com"
        required
        style={{
          flex: 1,
          padding: '11px 16px',
          background: 'var(--bg3)',
          border: '1px solid var(--border2)',
          borderRadius: 8,
          color: 'var(--text)',
          fontSize: 14,
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '11px 22px',
          background: 'var(--amber)',
          color: '#0A0A0F',
          borderRadius: 8,
          border: 'none',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {loading ? 'Submitting...' : 'Subscribe Free'}
      </button>
    </form>
  )
}