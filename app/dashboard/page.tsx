'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalPosts: number
  publishedPosts: number
  totalViews: number
  avgSeoScore: number
  recentPosts: any[]
  scheduledPosts: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [generating, setGenerating] = useState(false)
  const [genStep, setGenStep] = useState(-1)
  const [notification, setNotification] = useState('')
  const [topicInput, setTopicInput] = useState('')

  const GEN_STEPS = [
    'Fetching trending topics...',
    'Researching topic & keywords...',
    'Writing SEO-optimized article (3000+ words)...',
    'Generating featured image via Pollinations AI...',
    'Scoring SEO & adding schema markup...',
    'Publishing & pinging Google Search Console...',
  ]

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/dashboard/stats')
      const data = await res.json()
      setStats(data)
    } catch {}
  }

  async function handleGenerate() {
    setGenerating(true)
    setGenStep(0)
    const stepInterval = setInterval(() => {
      setGenStep(prev => {
        if (prev >= GEN_STEPS.length - 1) { clearInterval(stepInterval); return prev }
        return prev + 1
      })
    }, 2000)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicInput || undefined }),
      })
      const data = await res.json()
      clearInterval(stepInterval)
      setGenStep(GEN_STEPS.length)
      setNotification(data.success ? `✓ Published: "${data.post?.title}"` : `Error: ${data.error}`)
      fetchStats()
    } catch (e: any) {
      clearInterval(stepInterval)
      setNotification(`Error: ${e.message}`)
    } finally {
      setTimeout(() => { setGenerating(false); setGenStep(-1); setNotification('') }, 4000)
    }
  }

  const RECENT_ACTIVITIES = [
    { color: '#22c55e', text: 'Published "Best Free AI Tools 2025"', time: '12 min ago' },
    { color: '#FFA528', text: 'Image generated via Pollinations AI', time: '28 min ago' },
    { color: '#60a5fa', text: 'Trending: Solid-State Batteries detected', time: '1h ago' },
    { color: '#22c55e', text: 'Google indexed "Passive Income 2025"', time: '2h ago' },
    { color: '#a78bfa', text: 'SEO score 96 — new post published', time: '3h ago' },
    { color: '#FFA528', text: '4 posts scheduled for tomorrow', time: '4h ago' },
  ]

  return (
    <div style={{ flex: 1 }}>
      {/* Topbar */}
      <div style={{ padding: '0 24px', height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Dashboard Overview</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ background: '#22c55e18', border: '1px solid #22c55e30', color: '#22c55e', fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>● Autopilot ON</div>
          <button onClick={handleGenerate} disabled={generating}
            style={{ padding: '7px 16px', background: generating ? '#666' : 'var(--amber)', color: '#0A0A0F', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: generating ? 'not-allowed' : 'pointer' }}>
            {generating ? '⚡ Generating...' : '⚡ Generate Now'}
          </button>
        </div>
      </div>

      <div style={{ padding: 24 }}>

        {/* Topic input */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input value={topicInput} onChange={e => setTopicInput(e.target.value)}
            placeholder="Optional: Enter a specific topic, or leave blank to auto-pick trending topic..."
            style={{ flex: 1, padding: '9px 14px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none' }} />
          <button onClick={handleGenerate} disabled={generating}
            style={{ padding: '9px 20px', background: generating ? '#333' : '#FFA52820', color: 'var(--amber)', border: '1px solid #FFA52840', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            ⚡ Generate Post
          </button>
        </div>

        {/* Generation progress */}
        {generating && (
          <div style={{ background: 'var(--card)', border: '1px solid #FFA52840', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--amber)', marginBottom: 14 }}>⚡ AI Agent Generating Post...</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {GEN_STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12,
                  color: i < genStep ? '#22c55e' : i === genStep ? 'var(--amber)' : 'var(--text2)' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: `1px solid ${i < genStep ? '#22c55e40' : i === genStep ? '#FFA52840' : 'var(--border2)'}`,
                    background: i < genStep ? '#22c55e18' : i === genStep ? '#FFA52815' : 'var(--bg3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0 }}>
                    {i < genStep ? '✓' : i === genStep ? '●' : ''}
                  </div>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div style={{ background: 'var(--card)', border: '1px solid #22c55e30', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 8 }}>
            {notification}
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Posts', value: stats?.totalPosts ?? '--', sub: '↑ +12 this week', icon: '✎' },
            { label: 'Monthly Traffic', value: stats ? `${((stats.totalViews || 0) / 1000).toFixed(1)}K` : '--', sub: '↑ +23% vs last month', icon: '◈' },
            { label: 'Ad Revenue (MTD)', value: '$3,240', sub: 'On track for $8K/mo', icon: '$', amber: true },
            { label: 'Avg SEO Score', value: stats?.avgSeoScore ?? '--', sub: 'Target: 90+', icon: '✦' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text2)', marginBottom: 8 }}>
                {s.label} <span style={{ fontSize: 16 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', color: s.amber ? 'var(--amber)' : 'var(--text)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#22c55e', marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* 2-col layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 20 }}>
          {/* Recent posts */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Latest AI-Generated Posts</div>
              <Link href="/dashboard/posts" style={{ fontSize: 11, color: 'var(--amber)', textDecoration: 'none' }}>View all →</Link>
            </div>
            {(stats?.recentPosts || Array(5).fill(null)).map((post, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: 6, background: 'linear-gradient(135deg,#1a1a30,#2a1040)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {['🤖','💰','📱','🌍','🔋'][i % 5]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)' }}>
                    {post?.title || `Loading post ${i + 1}...`}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>
                    {post?.category || 'Technology'} · {post ? Math.ceil((post.word_count || 1500) / 200) : '?'} min read
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text2)', flexShrink: 0 }}>
                  {post?.views?.toLocaleString() || '--'}
                </div>
              </div>
            ))}
          </div>

          {/* Activity log */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Agent Activity Log</div>
            {RECENT_ACTIVITIES.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: i < RECENT_ACTIVITIES.length - 1 ? '1px solid #ffffff08' : 'none' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>{a.text}</div>
                  <div style={{ fontSize: 10, color: 'var(--text2)', opacity: .5, marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming schedule */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Publishing Schedule (Next 24h)</div>
            <span style={{ fontSize: 11, color: 'var(--text2)' }}>Auto-scheduled by AI</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 11, color: 'var(--text2)' }}>
                {['Topic', 'Category', 'Time', 'Status', 'SEO Est.'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid var(--border)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(stats?.scheduledPosts || [
                { title: 'AI Regulation 2025: What Every Business Must Know', category: 'Tech', time: '4:00 PM', status: 'writing', seo: 93 },
                { title: '10 Side Hustles That Made People Rich in 2025', category: 'Finance', time: '7:00 PM', status: 'queued', seo: 91 },
                { title: 'GPT-5 vs Claude 4: The Definitive AI Showdown', category: 'AI', time: '10:00 PM', status: 'queued', seo: 95 },
                { title: 'Best Budget Phones Under $300 — Tested & Ranked', category: 'Tech', time: 'Tomorrow 6AM', status: 'queued', seo: 88 },
              ]).map((row: any, i: number) => (
                <tr key={i} style={{ fontSize: 12 }}>
                  <td style={{ padding: '10px 10px', borderBottom: '1px solid #ffffff06', fontWeight: 500, maxWidth: 280 }}>{row.title}</td>
                  <td style={{ padding: '10px 10px', borderBottom: '1px solid #ffffff06' }}>
                    <span style={{ background: 'var(--bg3)', color: 'var(--text2)', fontSize: 10, padding: '2px 8px', borderRadius: 4 }}>{row.category}</span>
                  </td>
                  <td style={{ padding: '10px 10px', borderBottom: '1px solid #ffffff06', color: 'var(--text2)', fontSize: 11 }}>{row.time}</td>
                  <td style={{ padding: '10px 10px', borderBottom: '1px solid #ffffff06' }}>
                    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 500,
                      background: row.status === 'writing' ? '#FFA52820' : '#60a5fa18',
                      color: row.status === 'writing' ? 'var(--amber)' : '#60a5fa',
                      border: `1px solid ${row.status === 'writing' ? '#FFA52830' : '#60a5fa25'}` }}>
                      {row.status === 'writing' ? '✎ Writing' : '◷ Queued'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 10px', borderBottom: '1px solid #ffffff06' }}>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 500,
                      background: (row.seo || 90) >= 90 ? '#22c55e18' : '#FFA52815',
                      color: (row.seo || 90) >= 90 ? '#22c55e' : 'var(--amber)' }}>
                      {row.seo || 90}
                    </span>
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
