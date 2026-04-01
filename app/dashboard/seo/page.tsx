'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SeoAuditPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fixing, setFixing] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard/posts?limit=200')
      .then(r => r.json())
      .then(d => { setPosts(d.posts || []); setLoading(false) })
  }, [])

  function auditPost(post: any) {
    const issues: string[] = []
    if (!post.meta_title || post.meta_title.length < 50) issues.push('Meta title too short (<50 chars)')
    if (!post.meta_title || post.meta_title.length > 65) issues.push('Meta title too long (>65 chars)')
    if (!post.meta_description || post.meta_description.length < 140) issues.push('Meta description too short')
    if (!post.meta_description || post.meta_description.length > 165) issues.push('Meta description too long')
    if ((post.word_count || 0) < 1500) issues.push('Content too short (<1500 words)')
    if ((post.seo_score || 0) < 80) issues.push('Low SEO score (<80)')
    if (!post.featured_image) issues.push('No featured image')
    return issues
  }

  const withIssues = posts.filter(p => auditPost(p).length > 0)
  const perfect = posts.filter(p => auditPost(p).length === 0)
  const avgScore = posts.length ? Math.round(posts.reduce((s, p) => s + (p.seo_score || 0), 0) / posts.length) : 0

  async function autoFix(postId: string) {
    setFixing(postId)
    // Re-generate SEO fields for this post
    const post = posts.find(p => p.id === postId)
    if (!post) { setFixing(null); return }

    const res = await fetch('/api/seo/fix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, title: post.title }),
    })
    const data = await res.json()
    if (data.success) {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...data.updated } : p))
    }
    setFixing(null)
  }

  return (
    <div style={{ flex: 1 }}>
      <div style={{ padding: '0 24px', height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>SEO Audit</div>
      </div>

      <div style={{ padding: 24 }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Posts Audited', value: posts.length, color: 'var(--text)' },
            { label: 'Need Fixes', value: withIssues.length, color: '#ef4444' },
            { label: 'Perfect Score', value: perfect.length, color: '#22c55e' },
            { label: 'Avg SEO Score', value: avgScore, color: avgScore >= 90 ? '#22c55e' : 'var(--amber)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Posts with issues */}
        {withIssues.length > 0 && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                Posts Needing Attention
                <span style={{ marginLeft: 8, fontSize: 10, background: '#ef444418', color: '#ef4444', border: '1px solid #ef444425', padding: '2px 8px', borderRadius: 20 }}>{withIssues.length}</span>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ fontSize: 11, color: 'var(--text2)' }}>
                  {['Post', 'SEO Score', 'Issues', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '1px solid var(--border)', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>Loading...</td></tr>
                ) : withIssues.map(post => {
                  const issues = auditPost(post)
                  return (
                    <tr key={post.id} style={{ borderBottom: '1px solid #ffffff06', fontSize: 12 }}>
                      <td style={{ padding: '12px 16px', maxWidth: 300 }}>
                        <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                        <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>{post.category}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: (post.seo_score || 0) >= 80 ? 'var(--amber)' : '#ef4444' }}>
                          {post.seo_score || '--'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', maxWidth: 280 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {issues.map(issue => (
                            <span key={issue} style={{ fontSize: 9, background: '#ef444415', color: '#ef4444', border: '1px solid #ef444420', padding: '2px 6px', borderRadius: 4 }}>
                              {issue}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link href={`/dashboard/posts/${post.id}/edit`}
                            style={{ padding: '4px 10px', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, textDecoration: 'none' }}>
                            Edit
                          </Link>
                          <button onClick={() => autoFix(post.id)} disabled={fixing === post.id}
                            style={{ padding: '4px 10px', background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid #FFA52830', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>
                            {fixing === post.id ? 'Fixing...' : '⚡ Auto-fix'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* All-good posts */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>
              Posts with Perfect SEO
              <span style={{ marginLeft: 8, fontSize: 10, background: '#22c55e18', color: '#22c55e', border: '1px solid #22c55e25', padding: '2px 8px', borderRadius: 20 }}>{perfect.length}</span>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 11, color: 'var(--text2)' }}>
                {['Post Title', 'Category', 'SEO Score', 'Words', 'Published'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '1px solid var(--border)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {perfect.slice(0, 20).map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid #ffffff06', fontSize: 12 }}>
                  <td style={{ padding: '11px 16px', fontWeight: 500, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ background: 'var(--bg3)', color: 'var(--text2)', fontSize: 10, padding: '2px 8px', borderRadius: 4 }}>{post.category}</span>
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#22c55e' }}>{post.seo_score}</span>
                  </td>
                  <td style={{ padding: '11px 16px', color: 'var(--text2)' }}>{(post.word_count || 0).toLocaleString()}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--text2)', fontSize: 11 }}>
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}
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
