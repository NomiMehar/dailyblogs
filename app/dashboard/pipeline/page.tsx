'use client'

const PIPELINE_STAGES = [
  {
    icon: '🔍', title: 'Trend Discovery', color: '#60a5fa',
    desc: 'Monitors Google Trends RSS, Reddit, and HackerNews every 2 hours to find hot topics with high search volume and low competition.',
    status: 'Running', progress: 75, badge: 'active',
    apis: ['Google Trends RSS (free)', 'Reddit JSON API (free)', 'HackerNews Algolia (free)'],
  },
  {
    icon: '🧠', title: 'AI Content Writer', color: '#FFA528',
    desc: 'Uses Claude (Anthropic) to write 2,500–3,500 word SEO-optimized articles with H2/H3 headings, FAQs, internal links, and natural keyword density.',
    status: 'Writing now', progress: 45, badge: 'amber',
    apis: ['Anthropic Claude API (free tier)'],
  },
  {
    icon: '🖼', title: 'Image Generator', color: '#a78bfa',
    desc: 'Auto-generates unique featured images using Pollinations.ai — 100% free, no API key, unlimited generations. Just uses the post title.',
    status: 'Ready', progress: 100, badge: 'green',
    apis: ['Pollinations.ai (100% free · unlimited)'],
  },
  {
    icon: '📊', title: 'SEO Optimizer', color: '#22c55e',
    desc: 'Auto-injects meta title, meta description, Open Graph tags, Twitter Card, JSON-LD schema (Article + FAQ + BreadcrumbList), canonical URLs, and internal links.',
    status: 'Active', progress: 90, badge: 'green',
    apis: ['Google Search Console API (free)'],
  },
  {
    icon: '🚀', title: 'Auto Publisher', color: '#ef4444',
    desc: 'Publishes posts at optimal times (6 AM, 12 PM, 4 PM, 9 PM) via Vercel Cron Jobs, submits sitemap to Google, and tracks views.',
    status: 'Scheduled', progress: 60, badge: 'active',
    apis: ['Vercel Cron Jobs (free tier)', 'Google Sitemap Ping'],
  },
  {
    icon: '💰', title: 'Revenue Layer', color: '#22c55e',
    desc: 'Auto-inserts Google AdSense slots, Amazon affiliate links, and email capture forms. Tracks RPM per category and optimizes ad placement.',
    status: 'Earning', progress: 100, badge: 'green',
    apis: ['Google AdSense', 'Amazon Associates', 'Mailchimp (free tier)'],
  },
]

const FREE_APIS = [
  { name: 'Anthropic Claude API', purpose: 'Article generation, SEO copy', cost: 'Free tier', limit: '5 req/min', status: 'green' },
  { name: 'Pollinations.ai', purpose: 'Featured image generation', cost: '100% Free', limit: 'Unlimited', status: 'green' },
  { name: 'Google Trends RSS', purpose: 'Trending topic discovery', cost: 'Free', limit: 'Unlimited', status: 'green' },
  { name: 'Reddit JSON API', purpose: 'Hot topic discovery', cost: 'Free', limit: '60 req/min', status: 'green' },
  { name: 'HackerNews Algolia API', purpose: 'Tech trend discovery', cost: 'Free', limit: '10,000/hr', status: 'green' },
  { name: 'Google Search Console API', purpose: 'Sitemap ping, indexing', cost: 'Free', limit: '200 req/day', status: 'green' },
  { name: 'Vercel', purpose: 'Hosting + cron jobs', cost: 'Free tier', limit: '100GB/mo', status: 'green' },
  { name: 'Supabase', purpose: 'Database for posts & analytics', cost: 'Free tier', limit: '500MB DB', status: 'green' },
]

export default function PipelinePage() {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ padding: '0 24px', height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>AI Pipeline</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#22c55e' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
          All systems operational
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {/* Pipeline stages */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
          {PIPELINE_STAGES.map(stage => (
            <div key={stage.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stage.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>
                {stage.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{stage.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12 }}>{stage.desc}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {stage.apis.map(api => (
                  <span key={api} style={{ fontSize: 9, background: 'var(--bg3)', color: 'var(--text2)', padding: '2px 7px', borderRadius: 4, border: '1px solid var(--border)' }}>{api}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: stage.badge === 'green' ? '#22c55e' : stage.badge === 'amber' ? 'var(--amber)' : '#22c55e', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 11, color: stage.badge === 'green' ? '#22c55e' : stage.badge === 'amber' ? 'var(--amber)' : '#22c55e', fontWeight: 500 }}>
                  {stage.status}
                </span>
              </div>
              <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stage.progress}%`, background: stage.badge === 'green' ? '#22c55e' : 'var(--amber)', borderRadius: 2, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline flow diagram */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 20 }}>Automation Flow</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
            {['Vercel Cron fires', 'Fetch trending', 'Claude writes', 'Pollinations image', 'SEO inject', 'Publish to DB', 'Ping Google'].map((step, i, arr) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, padding: '8px 12px', fontSize: 11, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                  {step}
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 24, height: 1, background: 'var(--amber)', position: 'relative', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', right: -4, top: -3, width: 0, height: 0, borderLeft: '6px solid var(--amber)', borderTop: '3px solid transparent', borderBottom: '3px solid transparent' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 14, lineHeight: 1.6 }}>
            This pipeline runs automatically 4× per day via Vercel Cron Jobs. Each run takes ~60 seconds and produces a fully published, SEO-optimized article with a unique AI-generated image.
          </div>
        </div>

        {/* Free APIs table */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Free APIs Used — Zero Monthly Cost</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 11, color: 'var(--text2)' }}>
                {['API / Service', 'Purpose', 'Cost', 'Rate Limit', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid var(--border)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FREE_APIS.map(api => (
                <tr key={api.name} style={{ fontSize: 12, borderBottom: '1px solid #ffffff06' }}>
                  <td style={{ padding: '11px 12px', fontWeight: 500 }}>{api.name}</td>
                  <td style={{ padding: '11px 12px', color: 'var(--text2)' }}>{api.purpose}</td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: '#22c55e18', color: '#22c55e', border: '1px solid #22c55e25', fontWeight: 500 }}>{api.cost}</span>
                  </td>
                  <td style={{ padding: '11px 12px', color: 'var(--text2)', fontSize: 11 }}>{api.limit}</td>
                  <td style={{ padding: '11px 12px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 14, padding: '12px 14px', background: '#22c55e10', border: '1px solid #22c55e20', borderRadius: 8, fontSize: 12, color: '#22c55e' }}>
            💡 Total infrastructure cost: <strong>$0/month</strong> on free tiers. When you start earning, upgrade Supabase to Pro ($25/mo) for more database space.
          </div>
        </div>
      </div>
    </div>
  )
}
