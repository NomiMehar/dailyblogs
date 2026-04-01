'use client'
import { useState } from 'react'

const SCHEDULED = [
  { title: 'AI Regulation 2025: What Every Business Must Know', cat: 'Tech', time: 'Today 4:00 PM', status: 'writing', seo: 93, kw: 'AI regulation, compliance' },
  { title: '10 Side Hustles That Made People Rich in 2025', cat: 'Finance', time: 'Today 7:00 PM', status: 'queued', seo: 91, kw: 'side hustle, passive income' },
  { title: 'GPT-5 vs Claude 4: The Definitive AI Showdown', cat: 'AI', time: 'Today 10:00 PM', status: 'queued', seo: 95, kw: 'GPT-5, Claude, AI comparison' },
  { title: 'Best Budget Phones Under $300 — Tested & Ranked', cat: 'Tech', time: 'Tomorrow 6:00 AM', status: 'queued', seo: 88, kw: 'budget smartphone, review' },
  { title: 'Climate Tech Startups Getting Billions in 2025', cat: 'Business', time: 'Tomorrow 9:00 AM', status: 'queued', seo: 90, kw: 'climate tech, startups, funding' },
  { title: 'How to Invest in Index Funds for Beginners', cat: 'Finance', time: 'Tomorrow 12:00 PM', status: 'queued', seo: 92, kw: 'index funds, investing, beginners' },
]

export default function SchedulePage() {
  const [postsPerDay, setPostsPerDay] = useState('1')
  const [times, setTimes] = useState(['06:00', '12:00', '16:00', '21:00'])
  const [saved, setSaved] = useState(false)

  const SCHEDULE_TIMES = ['00:00','03:00','06:00','09:00','12:00','15:00','16:00','18:00','21:00','23:00']

  return (
    <div style={{ flex: 1 }}>
      <div style={{ padding: '0 24px', height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Publishing Schedule</div>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          style={{ padding: '7px 16px', background: saved ? '#22c55e' : 'var(--amber)', color: '#0A0A0F', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          {saved ? '✓ Saved' : 'Save Schedule'}
        </button>
      </div>

      <div style={{ padding: 24 }}>
        {/* Upcoming queue */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>📅 Upcoming Queue (Next 48h)</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 11, color: 'var(--text2)' }}>
                {['Title', 'Category', 'Scheduled', 'Status', 'Est. SEO', 'Keywords'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid var(--border)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCHEDULED.map((row, i) => (
                <tr key={i} style={{ fontSize: 12, borderBottom: i < SCHEDULED.length - 1 ? '1px solid #ffffff06' : 'none' }}>
                  <td style={{ padding: '11px 10px', fontWeight: 500, maxWidth: 240 }}>{row.title}</td>
                  <td style={{ padding: '11px 10px' }}>
                    <span style={{ background: 'var(--bg3)', color: 'var(--text2)', fontSize: 10, padding: '2px 8px', borderRadius: 4 }}>{row.cat}</span>
                  </td>
                  <td style={{ padding: '11px 10px', color: 'var(--text2)', fontSize: 11 }}>{row.time}</td>
                  <td style={{ padding: '11px 10px' }}>
                    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 500,
                      background: row.status === 'writing' ? '#FFA52820' : '#60a5fa18',
                      color: row.status === 'writing' ? 'var(--amber)' : '#60a5fa',
                      border: `1px solid ${row.status === 'writing' ? '#FFA52830' : '#60a5fa25'}` }}>
                      {row.status === 'writing' ? '✎ Writing' : '◷ Queued'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 10px' }}>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 500,
                      background: row.seo >= 90 ? '#22c55e18' : '#FFA52815',
                      color: row.seo >= 90 ? '#22c55e' : 'var(--amber)' }}>
                      {row.seo}
                    </span>
                  </td>
                  <td style={{ padding: '11px 10px', color: 'var(--text2)', fontSize: 11 }}>{row.kw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Schedule config */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Posting Frequency</div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 8 }}>Posts per day</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['1','4','6','8','12'].map(n => (
                  <button key={n} onClick={() => setPostsPerDay(n)}
                    style={{ padding: '7px 16px', borderRadius: 7, border: 'none', fontSize: 13, cursor: 'pointer', fontWeight: postsPerDay === n ? 600 : 400,
                      background: postsPerDay === n ? 'var(--amber)' : 'var(--bg3)',
                      color: postsPerDay === n ? '#0A0A0F' : 'var(--text2)' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 8 }}>Publishing times (server timezone UTC)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {times.map((t, i) => (
                  <select key={i} value={t} onChange={e => setTimes(prev => prev.map((v, j) => j === i ? e.target.value : v))}
                    style={{ padding: '8px 10px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 7, color: 'var(--text)', fontSize: 12, outline: 'none' }}>
                    {SCHEDULE_TIMES.map(time => <option key={time} value={time}>{time}</option>)}
                  </select>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Topic Sources</div>
            {[
              { label: 'Google Trends (free)', active: true },
              { label: 'Reddit Hot Posts (free)', active: true },
              { label: 'HackerNews (free)', active: true },
              { label: 'Custom RSS Feeds', active: true },
              { label: 'Twitter/X Trending', active: false },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #ffffff06', fontSize: 12 }}>
                <span style={{ color: s.active ? 'var(--text)' : 'var(--text2)' }}>{s.label}</span>
                <div style={{ width: 34, height: 20, borderRadius: 10, background: s.active ? 'var(--amber)' : 'var(--bg3)', border: `1px solid ${s.active ? 'transparent' : 'var(--border2)'}`, position: 'relative' }}>
                  <div style={{ position: 'absolute', width: 14, height: 14, background: 'white', borderRadius: '50%', top: 2, left: s.active ? 17 : 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 14, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', fontSize: 12, color: 'var(--text2)' }}>
          💡 <strong style={{ color: 'var(--text)' }}>Vercel Cron:</strong> Schedule is controlled by <code style={{ background: 'var(--bg)', padding: '1px 5px', borderRadius: 4 }}>vercel.json</code>. Current config: runs at 6:00, 12:00, 16:00, 21:00 UTC daily. Each run auto-selects a trending topic and publishes a full article.
        </div>
      </div>
    </div>
  )
}
