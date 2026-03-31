'use client'
import { useEffect, useState } from 'react'

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/dashboard/analytics').then(r => r.json()).then(setData)
  }, [])

  const trafficBars = [40, 55, 48, 70, 62, 80, 75, 90, 85, 95, 88, 100, 92, 110]
  const maxBar = Math.max(...trafficBars)
  const revBars = [60, 40, 70, 50, 80, 65, 90, 55, 75, 85, 70, 60, 95, 80]
  const maxRev = Math.max(...revBars)

  const TOP_POSTS = [
    { title: 'How to Make $5000/Month with AI Tools', views: 12440, clicks: 890, revenue: 312, seo: 96 },
    { title: 'Best Free AI Image Generators 2025', views: 9120, clicks: 543, revenue: 201, seo: 94 },
    { title: 'ChatGPT Prompts for Business Growth', views: 7880, clicks: 412, revenue: 178, seo: 92 },
    { title: 'Passive Income Strategies That Work in 2025', views: 6340, clicks: 321, revenue: 144, seo: 88 },
    { title: 'Top 10 AI Tools Every Developer Needs', views: 5210, clicks: 280, revenue: 121, seo: 90 },
  ]

  const REVENUE_SOURCES = [
    { label: 'Google AdSense', amount: 2100, pct: 65, color: '#FFA528' },
    { label: 'Affiliate Links', amount: 890, pct: 27, color: '#60a5fa' },
    { label: 'Sponsored Posts', amount: 250, pct: 8, color: '#a78bfa' },
  ]

  return (
    <div style={{ flex: 1 }}>
      <div style={{ padding: '0 24px', height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Analytics</div>
      </div>

      <div style={{ padding: 24 }}>
        {/* Revenue stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Revenue (MTD)', value: '$3,240', sub: '+18% vs last month', amber: true },
            { label: 'Google AdSense', value: '$2,100', sub: '↑ +18%', amber: true },
            { label: 'Affiliate Links', value: '$890', sub: '↑ +41%', amber: true },
            { label: 'Sponsored Posts', value: '$250', sub: '2 active deals', amber: true },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--amber)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#22c55e', marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          {/* Traffic chart */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Daily Traffic — Last 14 Days</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 120, padding: '0 4px' }}>
              {trafficBars.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', background: 'var(--amber)', borderRadius: '3px 3px 0 0', height: `${(v / maxBar) * 100}%`, opacity: 0.8, transition: 'opacity .2s', cursor: 'default' }}
                    title={`${(v * 800).toLocaleString()} views`} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text2)', marginTop: 8, padding: '0 2px' }}>
              <span>14 days ago</span><span>Today</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 8 }}>Total: <span style={{ color: 'var(--text)', fontWeight: 500 }}>84,200 views</span></div>
          </div>

          {/* Revenue breakdown */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Revenue Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {REVENUE_SOURCES.map(s => (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text2)' }}>{s.label}</span>
                    <span style={{ fontWeight: 500, color: s.color }}>${s.amount.toLocaleString()} ({s.pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: '12px', background: 'var(--bg3)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>Projected Monthly Revenue</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--amber)' }}>$8,200</div>
              <div style={{ fontSize: 11, color: '#22c55e' }}>↑ On track for $12K next month</div>
            </div>
          </div>
        </div>

        {/* Top posts table */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Top Performing Posts — By Organic Traffic</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 11, color: 'var(--text2)' }}>
                {['Post Title', 'Views', 'Clicks', 'Revenue', 'SEO Score'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid var(--border)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_POSTS.map((post, i) => (
                <tr key={i} style={{ fontSize: 12, borderBottom: i < TOP_POSTS.length - 1 ? '1px solid #ffffff06' : 'none' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 500, color: 'var(--text)', maxWidth: 300 }}>{post.title}</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text2)' }}>{post.views.toLocaleString()}</td>
                  <td style={{ padding: '12px 10px', color: '#60a5fa' }}>{post.clicks.toLocaleString()}</td>
                  <td style={{ padding: '12px 10px', color: 'var(--amber)', fontWeight: 500 }}>${post.revenue}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 500,
                      background: post.seo >= 90 ? '#22c55e18' : '#FFA52815',
                      color: post.seo >= 90 ? '#22c55e' : 'var(--amber)' }}>
                      {post.seo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Revenue goal */}
        <div style={{ background: 'var(--card)', border: '1px solid #FFA52830', borderRadius: 12, padding: 20, marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Annual Revenue Goal: $1,000,000</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>Current pace: $98,400/year · Need 10x growth</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--amber)' }}>9.8%</div>
          </div>
          <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '9.8%', background: 'linear-gradient(90deg, var(--amber), #ff6b00)', borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 8 }}>
            To reach $1M/year: Grow to ~500K monthly visitors + optimize RPM. At current growth rate: 18–24 months.
          </div>
        </div>
      </div>
    </div>
  )
}
