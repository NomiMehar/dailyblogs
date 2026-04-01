'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SearchResults() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    setLoading(true)
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.results || [])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const siteName = 'Blogs Dairy'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, background: 'var(--amber)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✦</div>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, fontWeight: 700, color: 'var(--amber)' }}>{siteName}</span>
          </Link>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles..."
            autoFocus
            style={{ flex: 1, padding: '8px 14px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none' }}
          />
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        {query.length < 2 ? (
          <p style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', marginTop: 60 }}>Type at least 2 characters to search...</p>
        ) : loading ? (
          <p style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', marginTop: 60 }}>Searching...</p>
        ) : results.length === 0 ? (
          <p style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', marginTop: 60 }}>No results found for "{query}"</p>
        ) : (
          <>
            <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 20 }}>{results.length} results for "{query}"</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
                    <span style={{ fontSize: 9, color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{post.category}</span>
                    <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, margin: '6px 0 8px' }}>{post.title}</h2>
                    <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return <Suspense><SearchResults /></Suspense>
}
