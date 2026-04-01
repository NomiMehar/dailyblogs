'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'content'|'seo'|'preview'>('content')

  useEffect(() => {
    fetch(`/api/dashboard/posts/${id}`)
      .then(r => r.json())
      .then(data => { setPost(data); setLoading(false) })
  }, [id])

  const set = (key: string, val: any) => setPost((p: any) => ({ ...p, [key]: val }))

  async function save() {
    setSaving(true)
    await fetch(`/api/dashboard/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: post.title, content: post.content, excerpt: post.excerpt,
        meta_title: post.meta_title, meta_description: post.meta_description,
        category: post.category, status: post.status,
        tags: typeof post.tags === 'string' ? post.tags.split(',').map((t: string) => t.trim()) : post.tags,
      }),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', fontSize: 14 }}>
      Loading post...
    </div>
  )

  const inputStyle = { width: '100%', padding: '9px 12px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }
  const labelStyle = { fontSize: 11, color: 'var(--text2)', display: 'block' as const, marginBottom: 6, fontWeight: 500 }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div style={{ padding: '0 24px', height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 13 }}>← Back</button>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Edit Post</div>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: post.status === 'published' ? '#22c55e18' : '#ffffff10', color: post.status === 'published' ? '#22c55e' : 'var(--text2)', border: `1px solid ${post.status === 'published' ? '#22c55e25' : 'var(--border)'}` }}>
            {post.status}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"
            style={{ padding: '7px 14px', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, textDecoration: 'none' }}>
            View Live ↗
          </a>
          <button onClick={save} disabled={saving}
            style={{ padding: '7px 18px', background: saved ? '#22c55e' : 'var(--amber)', color: '#0A0A0F', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', background: 'var(--bg)', paddingLeft: 24 }}>
        {(['content','seo','preview'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '10px 18px', fontSize: 12, cursor: 'pointer', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--amber)' : 'transparent'}`, color: tab === t ? 'var(--amber)' : 'var(--text2)', fontWeight: tab === t ? 500 : 400, marginBottom: -1, fontFamily: 'inherit' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

        {tab === 'content' && (
          <div style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input value={post.title || ''} onChange={e => set('title', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={post.category || ''} onChange={e => set('category', e.target.value)}
                  style={{ ...inputStyle, width: 160 }}>
                  {['Technology','AI & ML','Finance','Business','Health','Gaming','Crypto','Science'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Excerpt / Summary</label>
              <textarea value={post.excerpt || ''} onChange={e => set('excerpt', e.target.value)}
                rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Content (HTML)</label>
                <span style={{ fontSize: 11, color: 'var(--text2)' }}>
                  {post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length?.toLocaleString() || 0} words
                </span>
              </div>
              <textarea value={post.content || ''} onChange={e => set('content', e.target.value)}
                rows={30} style={{ ...inputStyle, resize: 'vertical' as const, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6 }} />
            </div>

            <div>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input value={Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '')}
                onChange={e => set('tags', e.target.value)} style={inputStyle} placeholder="AI, technology, tools" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={post.status || 'draft'} onChange={e => set('status', e.target.value)} style={inputStyle}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Featured Image URL</label>
                <input value={post.featured_image || ''} onChange={e => set('featured_image', e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>
        )}

        {tab === 'seo' && (
          <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>SEO Score</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: (post.seo_score || 0) >= 90 ? '#22c55e' : 'var(--amber)' }}>{post.seo_score || '--'}/100</div>
              </div>
              {[
                { label: 'Meta title length', ok: post.meta_title?.length >= 50 && post.meta_title?.length <= 65, note: `${post.meta_title?.length || 0}/65 chars` },
                { label: 'Meta description length', ok: post.meta_description?.length >= 140 && post.meta_description?.length <= 165, note: `${post.meta_description?.length || 0}/165 chars` },
                { label: 'Has H2 headings', ok: post.content?.includes('<h2'), note: '' },
                { label: 'Has FAQ section', ok: post.content?.includes('faq'), note: '' },
                { label: 'Word count 2500+', ok: (post.word_count || 0) >= 2500, note: `${(post.word_count || 0).toLocaleString()} words` },
                { label: 'Has keywords', ok: post.keywords?.length >= 3, note: `${post.keywords?.length || 0} keywords` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #ffffff06', fontSize: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: item.ok ? '#22c55e' : '#ef4444', fontSize: 13 }}>{item.ok ? '✓' : '✗'}</span>
                    <span style={{ color: item.ok ? 'var(--text)' : 'var(--text2)' }}>{item.label}</span>
                  </span>
                  <span style={{ color: 'var(--text2)' }}>{item.note}</span>
                </div>
              ))}
            </div>

            <div>
              <label style={labelStyle}>Meta Title <span style={{ color: 'var(--text2)', fontWeight: 400 }}>({post.meta_title?.length || 0}/65 chars)</span></label>
              <input value={post.meta_title || ''} onChange={e => set('meta_title', e.target.value)} style={{ ...inputStyle, borderColor: post.meta_title?.length > 65 ? '#ef444460' : undefined }} />
              <div style={{ fontSize: 10, color: post.meta_title?.length > 65 ? '#ef4444' : 'var(--text2)', marginTop: 4 }}>Optimal: 50–65 characters</div>
            </div>

            <div>
              <label style={labelStyle}>Meta Description <span style={{ color: 'var(--text2)', fontWeight: 400 }}>({post.meta_description?.length || 0}/165 chars)</span></label>
              <textarea value={post.meta_description || ''} onChange={e => set('meta_description', e.target.value)}
                rows={3} style={{ ...inputStyle, resize: 'vertical' as const, borderColor: post.meta_description?.length > 165 ? '#ef444460' : undefined }} />
              <div style={{ fontSize: 10, color: post.meta_description?.length > 165 ? '#ef4444' : 'var(--text2)', marginTop: 4 }}>Optimal: 140–165 characters</div>
            </div>

            <div>
              <label style={labelStyle}>Focus Keywords</label>
              <input value={Array.isArray(post.keywords) ? post.keywords.join(', ') : (post.keywords || '')}
                onChange={e => set('keywords', e.target.value.split(',').map((k: string) => k.trim()))}
                style={inputStyle} placeholder="primary keyword, secondary keyword, long tail keyword" />
            </div>

            <div>
              <label style={labelStyle}>Slug (URL)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text2)', flexShrink: 0 }}>/blog/</span>
                <input value={post.slug || ''} onChange={e => set('slug', e.target.value)} style={{ ...inputStyle }} />
              </div>
            </div>

            {/* Google Preview */}
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 10, fontWeight: 500 }}>Google Search Preview</div>
              <div style={{ fontSize: 11, color: '#22c55e', marginBottom: 4 }}>
                {process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/blog/{post.slug}
              </div>
              <div style={{ fontSize: 16, color: '#60a5fa', marginBottom: 4, lineHeight: 1.3 }}>
                {post.meta_title || post.title || 'Post Title'}
              </div>
              <div style={{ fontSize: 13, color: '#9aa0a6', lineHeight: 1.5 }}>
                {post.meta_description || post.excerpt || 'No meta description set.'}
              </div>
            </div>
          </div>
        )}

        {tab === 'preview' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 32 }}>
              {post.featured_image && (
                <img src={post.featured_image} alt={post.title} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8, marginBottom: 24 }} />
              )}
              <span style={{ background: 'var(--amber)', color: '#0A0A0F', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
                {post.category}
              </span>
              <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1.3, margin: '16px 0 12px', color: 'var(--text)' }}>{post.title}</h1>
              <p style={{ fontSize: 14, color: 'var(--text2)', fontStyle: 'italic', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>{post.excerpt}</p>
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
