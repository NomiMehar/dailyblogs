# AutoBlog AI — Complete Setup Guide

A fully autonomous AI-powered blog that generates SEO-optimized content 24/7, publishes automatically, and earns money through ads and affiliate links.

## What This Does
- **Auto-generates** 4 full blog posts per day (2,500–3,500 words each)
- **Auto-picks** trending topics from Google Trends, Reddit, HackerNews
- **Auto-creates** featured images using Pollinations.ai (free, no API key)
- **Auto-injects** full SEO: meta tags, JSON-LD schema, Open Graph, canonical URLs
- **Auto-publishes** via Vercel Cron Jobs at optimal times
- **Auto-pings** Google Search Console on every publish
- **Full dashboard** to manage posts, view analytics, configure everything

## Tech Stack (All Free Tiers)
| Service | Purpose | Cost |
|---|---|---|
| Next.js 14 | Framework | Free |
| Vercel | Hosting + Cron | Free |
| Supabase | Database | Free |
| Anthropic Claude API | Content generation | Free credits |
| Pollinations.ai | Image generation | 100% Free |
| Google Trends RSS | Topic discovery | Free |
| Reddit JSON API | Topic discovery | Free |

---

## Setup in 15 Minutes

### 1. Clone & Install
```bash
git clone <your-repo>
cd autoblog-ai
npm install
```

### 2. Set Up Supabase
1. Go to [supabase.com](https://supabase.com) → New project
2. Go to SQL Editor → paste contents of `supabase-schema.sql` → Run
3. Go to Settings → API → copy your Project URL and anon/service keys

### 3. Get Your API Keys
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com) → API Keys → Create key
  - Free credits included on signup (~$5 worth = ~100 articles)
  - Each article costs ~$0.03–0.08 with Claude Sonnet
- **Pollinations.ai**: No key needed — it's completely free

### 4. Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_KEY=eyJh...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_NAME=Your Blog Name
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
CRON_SECRET=make-up-a-random-string-here
ADMIN_PASSWORD=your-admin-password
```

### 5. Run Locally
```bash
npm run dev
```
- Public blog: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Test generation: http://localhost:3000/dashboard/generate

### 6. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

Add all your `.env.local` values to Vercel → Project → Settings → Environment Variables.

Vercel will auto-detect the `vercel.json` cron config and start running your cron jobs automatically.

### 7. Set Up Google AdSense (Revenue)
1. Apply at [adsense.google.com](https://adsense.google.com)
2. Add your site URL and verify ownership
3. Copy your Publisher ID (`ca-pub-xxxxxxxxx`)
4. Add to `.env.local`: `NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxx`
5. Approval takes 1–4 weeks after you have content

### 8. Submit to Google Search Console
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your domain property
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`
4. First posts will appear in Google within 1–4 weeks

---

## Revenue Path

| Monthly Visitors | Est. Monthly Revenue |
|---|---|
| 10,000 | $200–500 |
| 50,000 | $1,000–2,500 |
| 100,000 | $2,000–5,000 |
| 500,000 | $10,000–25,000 |
| 1,000,000 | $20,000–50,000 |

**To reach $1M/year** you need ~500K–1M monthly visitors. Realistic timeline: 18–30 months with consistent publishing and good SEO.

Revenue comes from:
- Google AdSense (auto-inserted, ~$2–8 RPM)
- Amazon affiliate links (auto-inserted, 1–10% commission)
- Sponsored posts (negotiate directly once you have traffic)
- Email newsletter (collect emails, sell courses/products)

---

## File Structure
```
autoblog/
├── app/
│   ├── page.tsx              # Public homepage
│   ├── blog/
│   │   ├── page.tsx          # Blog index
│   │   └── [slug]/page.tsx   # Individual post
│   ├── dashboard/
│   │   ├── layout.tsx        # Dashboard sidebar
│   │   ├── page.tsx          # Overview
│   │   ├── posts/page.tsx    # Post management
│   │   ├── analytics/page.tsx
│   │   ├── schedule/page.tsx
│   │   ├── pipeline/page.tsx
│   │   ├── generate/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── generate/route.ts        # Main AI pipeline
│   │   ├── cron/generate/route.ts   # Vercel cron trigger
│   │   └── dashboard/...            # Dashboard APIs
│   ├── sitemap.ts
│   └── robots.ts
├── lib/
│   ├── ai-engine.ts          # Claude API + SEO scoring
│   ├── trending.ts           # Google Trends, Reddit, HN
│   ├── seo.ts                # Schema markup, sitemap
│   └── supabase.ts           # Database client
├── supabase-schema.sql       # Run this in Supabase
├── vercel.json               # Cron job config
└── .env.local.example        # Copy to .env.local
```

---

## Customization

### Change posting frequency
Edit `vercel.json`:
```json
{ "schedule": "0 6,12,16,21 * * *" }  // 4x daily
{ "schedule": "0 */3 * * *" }          // every 3 hours
{ "schedule": "0 9 * * *" }            // once daily at 9AM
```

### Add more topic sources
Edit `lib/trending.ts` — add any RSS feed:
```typescript
const res = await fetch('https://feeds.feedburner.com/TechCrunch')
```

### Change writing style
Edit `lib/ai-engine.ts` — modify the `userPrompt` variable.

### Add more ad slots
Edit `app/blog/[slug]/page.tsx` — add more AdSense placeholders between H2 sections.

---

## Cost Breakdown
- Vercel: **Free** (100GB bandwidth/month)
- Supabase: **Free** (500MB database, plenty for 10,000+ posts)
- Anthropic API: **~$0.03–0.08 per article** with Claude Sonnet
  - At 4 articles/day: ~$4–10/month
  - Scale back to 2/day to stay within free credits longer
- Pollinations.ai: **Free forever**
- Domain: **$10–15/year**

**Total: ~$15/year** (just domain cost until you scale up)
