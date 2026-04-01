'use client'
import { useState } from 'react'

const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <div onClick={onToggle} style={{ width: 38, height: 22, borderRadius: 11, background: on ? 'var(--amber)' : 'var(--bg3)', border: `1px solid ${on ? 'transparent' : 'var(--border2)'}`, position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background .2s' }}>
    <div style={{ position: 'absolute', width: 16, height: 16, background: 'white', borderRadius: '50%', top: 2, left: on ? 19 : 2, transition: 'left .2s' }} />
  </div>
)

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoPublish: true, longForm: true, internalLinks: true, faqSection: true,
    adsense: true, affiliate: true, emailCapture: true,
    schemaMarkup: true, openGraph: true, canonicalUrls: true, sitemapPing: true,
    googleTrends: true, reddit: true, hackernews: true, twitter: false,
    postsPerDay: '1', minSeoScore: '85', wordCount: '3000',
    adsenseId: '', anthropicKey: '', siteName: '', siteUrl: '',
  })
  const [saved, setSaved] = useState(false)

  const toggle = (key: string) => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  const set = (key: string, val: string) => setSettings(prev => ({ ...prev, [key]: val }))

  async function saveSettings() {
    await fetch('/api/dashboard/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Section = ({ title, children }: any) => (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  )

  const Row = ({ label, desc, children }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #ffffff06' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )

  return (
    <div style={{ flex: 1 }}>
      <div style={{ padding: '0 24px', height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Settings</div>
        <button onClick={saveSettings}
          style={{ padding: '7px 18px', background: saved ? '#22c55e' : 'var(--amber)', color: '#0A0A0F', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>

      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <Section title="Site Configuration">
            <Row label="Site Name" desc="Displayed in header and meta tags">
              <input value={settings.siteName} onChange={e => set('siteName', e.target.value)}
                placeholder="Blogs Dairy"
                style={{ width: 180, padding: '7px 10px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 7, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
            </Row>
            <Row label="Site URL" desc="Your production domain">
              <input value={settings.siteUrl} onChange={e => set('siteUrl', e.target.value)}
                placeholder="https://yourdomain.com"
                style={{ width: 180, padding: '7px 10px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 7, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
            </Row>
            <Row label="Anthropic API Key" desc="For AI content generation">
              <input type="password" value={settings.anthropicKey} onChange={e => set('anthropicKey', e.target.value)}
                placeholder="sk-ant-..."
                style={{ width: 180, padding: '7px 10px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 7, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
            </Row>
            <Row label="Google AdSense ID" desc="ca-pub-xxxxxxxxxx">
              <input value={settings.adsenseId} onChange={e => set('adsenseId', e.target.value)}
                placeholder="ca-pub-..."
                style={{ width: 180, padding: '7px 10px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 7, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
            </Row>
          </Section>

          <Section title="Content Generation">
            <Row label="Auto-publish on trending topics" desc="Generate posts when trends detected">
              <Toggle on={settings.autoPublish} onToggle={() => toggle('autoPublish')} />
            </Row>
            <Row label="Long-form articles (3000+ words)" desc="Longer content ranks better">
              <Toggle on={settings.longForm} onToggle={() => toggle('longForm')} />
            </Row>
            <Row label="Auto internal linking" desc="Link to related posts automatically">
              <Toggle on={settings.internalLinks} onToggle={() => toggle('internalLinks')} />
            </Row>
            <Row label="FAQ section generation" desc="Adds FAQ schema for rich snippets">
              <Toggle on={settings.faqSection} onToggle={() => toggle('faqSection')} />
            </Row>
            <Row label="Posts per day">
              <select value={settings.postsPerDay} onChange={e => set('postsPerDay', e.target.value)}
                style={{ padding: '7px 10px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 7, color: 'var(--text)', fontSize: 12, outline: 'none' }}>
                {['1','4','6','8','12'].map(v => <option key={v} value={v}>{v} posts/day</option>)}
              </select>
            </Row>
            <Row label="Min SEO score to publish">
              <select value={settings.minSeoScore} onChange={e => set('minSeoScore', e.target.value)}
                style={{ padding: '7px 10px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 7, color: 'var(--text)', fontSize: 12, outline: 'none' }}>
                {['75','80','85','90','95'].map(v => <option key={v} value={v}>{v}+</option>)}
              </select>
            </Row>
          </Section>
        </div>

        <div>
          <Section title="Topic Sources">
            <Row label="Google Trends RSS (free)" desc="Daily trending search topics">
              <Toggle on={settings.googleTrends} onToggle={() => toggle('googleTrends')} />
            </Row>
            <Row label="Reddit Hot Posts (free)" desc="Trending from r/technology, r/finance etc">
              <Toggle on={settings.reddit} onToggle={() => toggle('reddit')} />
            </Row>
            <Row label="HackerNews Front Page (free)" desc="Tech & startup trending topics">
              <Toggle on={settings.hackernews} onToggle={() => toggle('hackernews')} />
            </Row>
            <Row label="Twitter/X Trending (free)" desc="Requires Twitter API access">
              <Toggle on={settings.twitter} onToggle={() => toggle('twitter')} />
            </Row>
          </Section>

          <Section title="Monetization">
            <Row label="Google AdSense auto-injection" desc="Auto-insert ad slots in articles">
              <Toggle on={settings.adsense} onToggle={() => toggle('adsense')} />
            </Row>
            <Row label="Amazon Affiliate auto-links" desc="Auto-add affiliate product links">
              <Toggle on={settings.affiliate} onToggle={() => toggle('affiliate')} />
            </Row>
            <Row label="Email capture popup" desc="Build email list for newsletter">
              <Toggle on={settings.emailCapture} onToggle={() => toggle('emailCapture')} />
            </Row>
          </Section>

          <Section title="SEO Configuration">
            <Row label="Auto sitemap submission" desc="Ping Google on every publish">
              <Toggle on={settings.sitemapPing} onToggle={() => toggle('sitemapPing')} />
            </Row>
            <Row label="JSON-LD Schema markup" desc="Article + FAQ + BreadcrumbList">
              <Toggle on={settings.schemaMarkup} onToggle={() => toggle('schemaMarkup')} />
            </Row>
            <Row label="Open Graph / Twitter Card" desc="Optimize for social sharing">
              <Toggle on={settings.openGraph} onToggle={() => toggle('openGraph')} />
            </Row>
            <Row label="Canonical URLs">
              <Toggle on={settings.canonicalUrls} onToggle={() => toggle('canonicalUrls')} />
            </Row>
          </Section>

          {/* API Status */}
          <Section title="Free API Status">
            {[
              { name: 'Groq — Llama 3.3 70B (FREE)', status: settings.groqKey ? 'active' : 'needs_key', note: settings.groqKey ? 'Connected ✓' : 'Add GROQ_API_KEY (console.groq.com)' },
              { name: 'OpenRouter (FREE tier)', status: settings.openrouterKey ? 'active' : 'needs_key', note: settings.openrouterKey ? 'Connected ✓' : 'Add OPENROUTER_API_KEY' },
              { name: 'Anthropic Claude (paid)', status: settings.anthropicKey ? 'active' : 'needs_key', note: settings.anthropicKey ? 'Connected ✓' : 'Optional — add credits first' },
              { name: 'Pollinations.ai (images)', status: 'active', note: 'Free · No key needed' },
              { name: 'Google Trends RSS', status: 'active', note: 'Free · No key needed' },
              { name: 'Reddit JSON API', status: 'active', note: '60 req/min free' },
            ].map(api => (
              <div key={api.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ffffff06', fontSize: 12 }}>
                <span style={{ color: 'var(--text2)' }}>{api.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: 'var(--text2)', opacity: .7 }}>{api.note}</span>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: api.status === 'active' ? '#22c55e' : '#ef4444' }} />
                </div>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  )
}
