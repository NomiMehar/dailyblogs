'use client'
import { useState } from 'react'

const CATEGORIES = ['Technology', 'AI & ML', 'Finance', 'Business', 'Health', 'Gaming', 'Crypto', 'Science']
const SEED_TOPICS = [
  'How to Make Money with AI in 2025',
  'Best Free AI Tools That Replace Paid Software',
  'Passive Income Strategies That Actually Work',
  'Top Programming Languages to Learn This Year',
  'How AI is Changing the Job Market',
  'Crypto: What to Buy and What to Avoid',
  'Remote Work Tools That Boost Productivity',
  'The Future of Electric Vehicles',
]

const GEN_STEPS = [
  { label: 'Fetching trending topics', icon: '🔍' },
  { label: 'Researching keywords & search volume', icon: '📊' },
  { label: 'Writing SEO-optimized article (3000+ words)', icon: '✍️' },
  { label: 'Generating featured image (Pollinations AI)', icon: '🖼' },
  { label: 'Calculating SEO score & adding schema', icon: '⚡' },
  { label: 'Publishing & pinging Google Search Console', icon: '🚀' },
]

export default function GeneratePage() {
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('')
  const [generating, setGenerating] = useState(false)
  const [step, setStep] = useState(-1)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'manual' | 'auto'>('manual')

  async function generate() {
    setGenerating(true)
    setStep(0)
    setResult(null)
    setError('')

    let s = 0
    const interval = setInterval(() => {
      s++
      if (s < GEN_STEPS.length) setStep(s)
      else clearInterval(interval)
    }, 2200)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic || undefined, category: category || undefined }),
      })
      const data = await res.json()
      clearInterval(interval)
      setStep(GEN_STEPS.length)
      if (data.success) setResult(data.post)
      else setError(data.error || 'Generation failed')
    } catch (e: any) {
      clearInterval(interval)
      setError(e.message)
    }
    setGenerating(false)
  }

  return (
    <div style={{ flex: 1 }}>
      <div style={{ padding: '0 24px', height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Generate New Post</div>
      </div>

      <div style={{ padding: 24, maxWidth: 800 }}>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 8, border: '1px solid var(--border)', display: 'inline-flex', marginBottom: 24 }}>
          {['manual', 'auto'].map(m => (
            <button key={m} onClick={() => setMode(m as any)}
              style={{ padding: '6px 20px', borderRadius: 6, border: 'none', fontSize: 12, cursor: 'pointer', fontWeight: 500,
                background: mode === m ? 'var(--amber)' : 'transparent',
                color: mode === m ? '#0A0A0F' : 'var(--text2)' }}>
              {m === 'manual' ? '✎ Manual Topic' : '⚡ Auto Trending'}
            </button>
          ))}
        </div>

        {mode === 'manual' ? (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Manual Topic Generation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Topic / Title *</label>
                <input value={topic} onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. How to Start a Blog and Make $5000/Month"
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Category (optional)</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none' }}>
                  <option value="">Auto-detect from topic</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8 }}>Quick select topic:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SEED_TOPICS.map(t => (
                  <button key={t} onClick={() => setTopic(t)}
                    style={{ padding: '5px 12px', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 11, cursor: 'pointer' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Auto Trending Topic</h2>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
              The AI agent will automatically fetch the hottest trending topic from Google Trends, Reddit, and HackerNews, then write a full SEO-optimized article about it.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              {['Google Trends RSS', 'Reddit Hot Posts', 'HackerNews Front Page'].map(s => (
                <span key={s} style={{ background: '#22c55e18', color: '#22c55e', border: '1px solid #22c55e25', fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>✓ {s}</span>
              ))}
            </div>
          </div>
        )}

        <button onClick={generate} disabled={generating || (mode === 'manual' && !topic)}
          style={{ width: '100%', padding: '14px', background: generating ? '#333' : 'var(--amber)', color: generating ? 'var(--text2)' : '#0A0A0F', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer', marginBottom: 24 }}>
          {generating ? '⚡ Generating...' : '⚡ Generate & Publish Post'}
        </button>

        {/* Progress */}
        {generating && (
          <div style={{ background: 'var(--card)', border: '1px solid #FFA52840', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--amber)', marginBottom: 14 }}>AI Agent Working...</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {GEN_STEPS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i < step ? 12 : 14,
                    background: i < step ? '#22c55e18' : i === step ? '#FFA52818' : 'var(--bg3)',
                    border: `1px solid ${i < step ? '#22c55e40' : i === step ? '#FFA52840' : 'var(--border)'}` }}>
                    {i < step ? '✓' : s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: i < step ? '#22c55e' : i === step ? 'var(--amber)' : 'var(--text2)', fontWeight: i === step ? 500 : 400 }}>
                      {s.label}
                    </div>
                    {i === step && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>In progress...</div>}
                    {i < step && <div style={{ fontSize: 11, color: '#22c55e', marginTop: 2 }}>Done</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#ef444418', border: '1px solid #ef444430', borderRadius: 10, padding: '14px 16px', marginBottom: 16, fontSize: 13, color: '#ef4444' }}>
            ✗ {error}
          </div>
        )}

        {/* Success result */}
        {result && (
          <div style={{ background: '#22c55e10', border: '1px solid #22c55e30', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#22c55e', marginBottom: 16 }}>✓ Post Published Successfully!</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Title', value: result.title },
                { label: 'Category', value: result.category },
                { label: 'Word Count', value: `${result.word_count?.toLocaleString()} words` },
                { label: 'SEO Score', value: result.seo_score },
              ].map(f => (
                <div key={f.label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{f.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href={`/blog/${result.slug}`} target="_blank" rel="noreferrer"
                style={{ padding: '9px 18px', background: 'var(--amber)', color: '#0A0A0F', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                View Live Post →
              </a>
              <button onClick={generate}
                style={{ padding: '9px 18px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                Generate Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
