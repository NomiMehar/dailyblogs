// lib/trending.ts
// Fetches trending topics from free APIs: Google Trends RSS, Reddit, HackerNews

export interface TrendingTopic {
  topic: string
  source: string
  category: string
  score: number
}

export async function fetchGoogleTrends(): Promise<TrendingTopic[]> {
  try {
    const res = await fetch('https://trends.google.com/trends/trendingsearches/daily/rss?geo=US', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AutoBlogAI/1.0)' },
      next: { revalidate: 7200 },
    })
    const text = await res.text()
    const titles = Array.from(text.matchAll(/<title><!\[CDATA\[(.+?)\]\]><\/title>/g))
      .map(m => m[1])
      .filter(t => t.length > 5 && !t.includes('Daily Search Trends'))
      .slice(0, 15)

    return titles.map((topic, i) => ({
      topic,
      source: 'google_trends',
      category: 'Technology',
      score: 100 - i * 5,
    }))
  } catch {
    return []
  }
}

export async function fetchRedditHot(subreddits = ['technology', 'worldnews', 'business', 'artificial', 'finance']): Promise<TrendingTopic[]> {
  const results: TrendingTopic[] = []

  for (const sub of subreddits) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=5`, {
        headers: { 'User-Agent': 'AutoBlogAI/1.0' },
        next: { revalidate: 3600 },
      })
      const data = await res.json()
      const posts = data?.data?.children || []
      posts.forEach((p: any, i: number) => {
        const title = p.data?.title
        if (title && title.length > 20 && title.length < 200 && !p.data.is_self === false) {
          results.push({
            topic: title,
            source: `reddit_r/${sub}`,
            category: subredditToCategory(sub),
            score: Math.round((p.data.score / 1000) * 10),
          })
        }
      })
    } catch {}
  }
  return results.slice(0, 20)
}

export async function fetchHackerNews(): Promise<TrendingTopic[]> {
  try {
    const res = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=15', {
      next: { revalidate: 3600 },
    })
    const data = await res.json()
    return (data.hits || []).map((h: any, i: number) => ({
      topic: h.title,
      source: 'hackernews',
      category: 'Technology',
      score: Math.round(h.points / 10),
    })).filter((t: TrendingTopic) => t.topic && t.topic.length > 15)
  } catch {
    return []
  }
}

export async function getAllTrendingTopics(): Promise<TrendingTopic[]> {
  const [google, reddit, hn] = await Promise.allSettled([
    fetchGoogleTrends(),
    fetchRedditHot(),
    fetchHackerNews(),
  ])

  const all: TrendingTopic[] = [
    ...(google.status === 'fulfilled' ? google.value : []),
    ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ...(hn.status === 'fulfilled' ? hn.value : []),
  ]

  // Deduplicate by similarity
  const seen = new Set<string>()
  return all.filter(t => {
    const key = t.topic.substring(0, 30).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).sort((a, b) => b.score - a.score)
}

function subredditToCategory(sub: string): string {
  const map: Record<string, string> = {
    technology: 'Technology', worldnews: 'Business',
    business: 'Business', artificial: 'AI & ML',
    finance: 'Finance', gaming: 'Gaming',
    science: 'Science', health: 'Health',
    cryptocurrency: 'Crypto',
  }
  return map[sub] || 'Technology'
}

// Fallback seed topics if APIs fail
export const SEED_TOPICS = [
  'How to Make Money with AI in 2025',
  'Best Free AI Tools for Productivity',
  'ChatGPT vs Claude: Which AI is Better?',
  'Passive Income Strategies That Work in 2025',
  'How to Start a Blog and Make Money',
  'Best Programming Languages to Learn in 2025',
  'Top 10 AI Startups to Watch This Year',
  'How to Invest in AI Stocks',
  'Remote Work Tools That Boost Productivity',
  'The Future of Cryptocurrency in 2025',
]
