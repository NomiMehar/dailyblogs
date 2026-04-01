import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '6rem', fontWeight: 700, color: 'var(--amber)', lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginTop: 16, marginBottom: 10 }}>Page Not Found</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 28 }}>The article you're looking for doesn't exist or was removed.</p>
        <Link href="/" style={{ display: 'inline-block', padding: '10px 24px', background: 'var(--amber)', color: '#0A0A0F', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
