'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/posts')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch {}
    setLoading(false)
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    setDeleting(id)
    await fetch(`/api/dashboard/posts/${id}`, { method: 'DELETE' })
    setPosts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  async function togglePublish(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    await fetch(`/api/dashboard/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    fetchPosts()
  }

  const filtered = posts.filter(p => {
    const matchStatus = filter === 'all' || p.status === filter
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const TABS = ['all', 'published', 'draft', 'scheduled']

  return (
    <div style={{ flex: 1 }}>
      {/* Topbar */}
      <div style={{ padding: '0 24px', height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Posts ({posts.length})</div>
        <Link href="/dashboard/generate">
          <button style={{ padding: '7px 16px', background: 'var(--amber)', color: '#0A0A0F', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            ⚡ Generate New Post
          </button>
        </Link>
      </div>

      <div style={{ padding: 24 }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 8, border: '1px solid var(--border)' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setFilter(tab)}
                style={{ padding: '5px 14px', borderRadius: 6, border: 'none', fontSize: 12, cursor: 'pointer', fontWeight: 500,
                  background: filter === tab ? 'var(--amber)' : 'transparent',
                  color: filter === tab ? '#0A0A0F' : 'var(--text2)' }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search posts..."
            style={{ flex: 1, padding: '8px 14px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none' }} />
        </div>

        {/* Posts Table */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 11, color: 'var(--text2)', borderBottom: '1px solid var(--border)' }}>
                {['Title', 'Category', 'Status', 'SEO', 'Views', 'Published', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(8).fill(null).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {Array(7).fill(null).map((_, j) => (
                      <td key={j} style={{ padding: '12px 14px' }}>
                        <div style={{ height: 14, background: 'var(--bg3)', borderRadius: 4, width: j === 0 ? '80%' : '60%', animation: 'pulse 1.5s infinite' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>No posts found</td></tr>
              ) : filtered.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid #ffffff06', fontSize: 12 }}>
                  <td style={{ padding: '12px 14px', maxWidth: 280 }}>
                    <div style={{ fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>{post.word_count?.toLocaleString() || '—'} words · {Math.ceil((post.word_count || 1500) / 200)} min read</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: 'var(--bg3)', color: 'var(--text2)', fontSize: 10, padding: '2px 8px', borderRadius: 4 }}>{post.category}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 500,
                      background: post.status === 'published' ? '#22c55e18' : post.status === 'scheduled' ? '#60a5fa18' : '#ffffff10',
                      color: post.status === 'published' ? '#22c55e' : post.status === 'scheduled' ? '#60a5fa' : 'var(--text2)',
                      border: `1px solid ${post.status === 'published' ? '#22c55e25' : post.status === 'scheduled' ? '#60a5fa25' : 'var(--border)'}` }}>
                      {post.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 500,
                      background: (post.seo_score || 0) >= 90 ? '#22c55e18' : '#FFA52815',
                      color: (post.seo_score || 0) >= 90 ? '#22c55e' : 'var(--amber)' }}>
                      {post.seo_score || '--'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text2)' }}>{(post.views || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text2)', fontSize: 11 }}>
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"
                        style={{ padding: '4px 10px', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, textDecoration: 'none' }}>
                        View
                      </a>
                      <button onClick={() => togglePublish(post.id, post.status)}
                        style={{ padding: '4px 10px', background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid #FFA52830', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>
                        {post.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => deletePost(post.id)} disabled={deleting === post.id}
                        style={{ padding: '4px 10px', background: '#ef444418', color: '#ef4444', border: '1px solid #ef444425', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>
                        {deleting === post.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
