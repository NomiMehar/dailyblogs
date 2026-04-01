# Blogs Dairy — Complete Setup Guide

> Fully autonomous AI blog: generates SEO-optimized posts 4× daily, publishes automatically, earns money through ads and affiliates. Zero human effort after setup.

## Quick Start (15 minutes)

```bash
# 1. Install
npm install
cp .env.local.example .env.local

# 2. Fill in .env.local (see below)

# 3. Run Supabase SQL files in order:
#    → supabase-schema.sql
#    → supabase-schema-extras.sql

# 4. Start
npm run dev
# Blog:      http://localhost:3000
# Dashboard: http://localhost:3000/dashboard

# 5. Deploy
npx vercel
```

## Required API Keys

| Key               | Where to get                  | Cost               |
| ----------------- | ----------------------------- | ------------------ |
| ANTHROPIC_API_KEY | console.anthropic.com         | Free credits (~$5) |
| SUPABASE keys (3) | supabase.com → Settings → API | Free tier          |
| ADMIN_PASSWORD    | Make one up                   | —                  |
| CRON_SECRET       | Make one up                   | —                  |

Pollinations.ai (images), Google Trends, Reddit, HackerNews — all free, no keys needed.

## File Structure

```
app/
  page.tsx                  Homepage
  blog/[slug]/page.tsx      Individual posts (full SEO)
  blog/category/[cat]/      Category pages
  about/page.tsx            About page
  privacy/page.tsx          Privacy policy (needed for AdSense)
  search/page.tsx           Live search
  login/page.tsx            Dashboard login
  feed.xml/route.ts         RSS feed
  dashboard/
    page.tsx                Overview + stats
    posts/page.tsx          Post management (CRUD)
    posts/[id]/edit/        Post editor
    analytics/page.tsx      Traffic + revenue charts
    schedule/page.tsx       Queue + cron config
    pipeline/page.tsx       AI pipeline status
    seo/page.tsx            SEO audit tool
    generate/page.tsx       Manual post generator
    settings/page.tsx       All settings
  api/
    generate/               Core AI pipeline
    trending/               Trend fetcher
    cron/generate/          Auto-publish (Vercel cron)
    cron/trending/          Auto-fetch trends
    cron/sitemap/           Daily Google ping
    search/                 Full-text search
    views/                  View counter
    subscribe/              Newsletter signup
    auth/login/             Dashboard auth
    seo/fix/                Auto-fix SEO fields
lib/
  ai-engine.ts              Claude API + SEO scorer
  trending.ts               Google Trends + Reddit + HN
  seo.ts                    Schema markup + sitemap
  affiliate.ts              Amazon affiliate injector
  supabase.ts               DB client
components/
  AdSlot.tsx                AdSense component
```

## How Posts Are Generated

Every 6 hours Vercel fires a cron:

1. Fetch trending topics (Google Trends + Reddit + HN)
2. Pick best unused topic
3. Claude writes 3,000 word article (H2/H3, FAQs, keywords)
4. Pollinations.ai generates featured image (free)
5. SEO score calculated, schema markup injected
6. Published to Supabase, Google pinged

## Revenue Path

| Monthly Visitors | Est. Monthly Revenue |
| ---------------- | -------------------- |
| 10,000           | $200–500             |
| 50,000           | $1,500–3,000         |
| 100,000          | $3,000–8,000         |
| 500,000          | $15,000–40,000       |

Revenue streams: Google AdSense (auto) + Amazon Affiliates (auto) + Sponsorships + Newsletter

## AdSense Setup

1. Publish 20+ articles first
2. Apply at adsense.google.com
3. Add `NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxx` to env
4. About page + Privacy page already included (required for approval)

## Changing Post Frequency

Edit vercel.json:

```json
"schedule": "0 */6 * * *"   // 4 posts/day (default)
"schedule": "0 */3 * * *"   // 8 posts/day
"schedule": "0 8 * * *"     // 1 post/day
```

## Monthly Cost

- Vercel: Free (up to 100GB/mo)
- Supabase: Free (up to 500MB)
- Anthropic: ~$4–10/mo at 4 posts/day
- Images: Free forever (Pollinations.ai)
- Domain: ~$12/year

Total at launch: ~$1/month
