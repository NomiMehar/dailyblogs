'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: '⊞' },
  { href: '/dashboard/posts', label: 'Posts', icon: '✎' },
  { href: '/dashboard/schedule', label: 'Schedule', icon: '◷' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '◈' },
  { href: '/dashboard/seo', label: 'SEO Audit', icon: '✦' },
  { href: '/dashboard/pipeline', label: 'AI Pipeline', icon: '⚙' },
  { href: '/dashboard/generate', label: 'Generate Now', icon: '⚡' },
  { href: '/dashboard/settings', label: 'Settings', icon: '≡' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* Sidebar */}
      <aside style={{ width: 220, background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'var(--amber)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✦</div>
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 15, fontWeight: 700, color: 'var(--amber)' }}>AutoBlog AI</span>
        </div>

        <nav style={{ padding: '12px 8px', flex: 1 }}>
          <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, padding: '8px 10px 4px', opacity: .5 }}>Main</div>
          {NAV.slice(0, 5).map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 7, marginBottom: 2,
                fontSize: 13, cursor: 'pointer',
                background: path === item.href ? 'var(--amber-dim)' : 'transparent',
                color: path === item.href ? 'var(--amber)' : 'var(--text2)',
                fontWeight: path === item.href ? 500 : 400,
              }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
              </div>
            </Link>
          ))}

          <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, padding: '12px 10px 4px', opacity: .5 }}>AI Engine</div>
          {NAV.slice(5).map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 7, marginBottom: 2,
                fontSize: 13, cursor: 'pointer',
                background: path === item.href ? 'var(--amber-dim)' : item.label === 'Generate Now' ? 'var(--amber-dim)' : 'transparent',
                color: path === item.href ? 'var(--amber)' : item.label === 'Generate Now' ? 'var(--amber)' : 'var(--text2)',
                fontWeight: path === item.href ? 500 : 400,
              }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ background: '#FFA52815', border: '1px solid #FFA52830', borderRadius: 8, padding: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, color: 'var(--amber)', marginBottom: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
              AI Agent Active
            </div>
            <p style={{ fontSize: 10, color: 'var(--text2)', lineHeight: 1.4 }}>Next post in 2h · 3 queued</p>
          </div>
          <Link href="/" style={{ display: 'block', marginTop: 8, fontSize: 11, color: 'var(--text2)', textDecoration: 'none', textAlign: 'center' }}>
            ← View Public Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
