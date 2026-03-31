// lib/ai-engine.ts
// Core AI engine: generates full SEO-optimized blog posts using Claude API

export interface GeneratedPost {
  title: string
  slug: string
  excerpt: string
  content: string
  metaTitle: string
  metaDescription: string
  tags: string[]
  keywords: string[]
  category: string
  imagePrompt: string
  seoScore: number
  wordCount: number
}

const CATEGORIES = ['Technology', 'AI & ML', 'Finance', 'Business', 'Health', 'Gaming', 'Crypto', 'Science']

function detectCategory(topic: string): string {
  const lower = topic.toLowerCase()
  if (lower.match(/ai|ml|gpt|llm|claude|openai|machine learning|neural/)) return 'AI & ML'
  if (lower.match(/crypto|bitcoin|ethereum|blockchain|defi|nft/)) return 'Crypto'
  if (lower.match(/stock|invest|money|finance|economy|bank|revenue/)) return 'Finance'
  if (lower.match(/startup|business|entrepreneur|market|sales/)) return 'Business'
  if (lower.match(/health|medical|fitness|diet|workout|mental/)) return 'Health'
  if (lower.match(/game|gaming|xbox|playstation|steam|esport/)) return 'Gaming'
  if (lower.match(/science|space|nasa|physics|biology|research/)) return 'Science'
  return 'Technology'
}

export async function generateBlogPost(topic: string): Promise<GeneratedPost> {
  const category = detectCategory(topic)
  const currentYear = new Date().getFullYear()

  const systemPrompt = `You are an expert SEO content writer and digital marketing specialist. 
You write engaging, authoritative, long-form blog articles that rank on Google's first page.
Your writing style is clear, helpful, and conversational — never robotic.
Always respond with valid JSON only, no markdown fences.`

  const userPrompt = `Write a complete, SEO-optimized blog post about: "${topic}"

Return a JSON object with these exact fields:
{
  "title": "Compelling H1 title with primary keyword (60 chars max)",
  "metaTitle": "SEO meta title (55-60 chars, includes keyword)",
  "metaDescription": "Compelling meta description (150-160 chars, includes keyword + CTA)",
  "excerpt": "2-3 sentence article summary for preview cards",
  "category": "${category}",
  "keywords": ["primary keyword", "secondary keyword 1", "secondary keyword 2", "long tail 1", "long tail 2", "long tail 3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "imagePrompt": "Detailed image generation prompt for a professional blog featured image",
  "content": "FULL HTML article content here (see requirements below)"
}

CONTENT REQUIREMENTS (very important):
- Write 2,500-3,500 words of rich HTML content
- Use proper HTML: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>
- Structure: Introduction → 5-7 main sections with H2 headings → Conclusion → FAQ section
- Include at least 6 H2 sections and 4 H3 subsections
- Add a FAQ section at the end with 5 Q&A pairs (use <div class="faq-item"><h3 class="faq-q">Q</h3><p class="faq-a">A</p></div>)
- Naturally use the primary keyword in: first 100 words, 2-3 H2s, throughout the body
- Keyword density: 1-2% (natural, not stuffed)
- Include current year ${currentYear} where relevant
- Add internal link placeholders: <a href="/blog/related-topic">anchor text</a>
- Make it genuinely helpful and informative — not fluff
- Add a compelling introduction that hooks the reader immediately
- Add a strong conclusion with a clear call-to-action`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Claude API error: ${response.status} - ${err}`)
  }

  const data = await response.json()
  const rawText = data.content[0].text.trim()

  // Strip any accidental markdown fences
  const jsonText = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
  const parsed = JSON.parse(jsonText)

  // Calculate SEO score
  const seoScore = calculateSeoScore(parsed)

  // Generate slug
  const slugify = (str: string) =>
    str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

  const wordCount = parsed.content.replace(/<[^>]*>/g, '').split(/\s+/).length

  return {
    ...parsed,
    slug: slugify(parsed.title),
    seoScore,
    wordCount,
  }
}

function calculateSeoScore(post: any): number {
  let score = 0
  const content = post.content || ''
  const title = post.title || ''
  const primaryKw = post.keywords?.[0] || ''

  // Title checks (20 pts)
  if (title.length >= 30 && title.length <= 65) score += 10
  if (primaryKw && title.toLowerCase().includes(primaryKw.toLowerCase())) score += 10

  // Meta checks (20 pts)
  if (post.metaTitle?.length >= 50 && post.metaTitle?.length <= 65) score += 10
  if (post.metaDescription?.length >= 140 && post.metaDescription?.length <= 165) score += 10

  // Content checks (40 pts)
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  if (wordCount >= 1500) score += 10
  if (wordCount >= 2500) score += 10
  if (content.includes('<h2>') || content.includes('<h2 ')) score += 10
  if (content.includes('faq')) score += 10

  // Keywords (10 pts)
  if (post.keywords?.length >= 4) score += 10

  // Tags (10 pts)
  if (post.tags?.length >= 3) score += 10

  return Math.min(100, score)
}

export function getImageUrl(prompt: string, width = 1200, height = 630): string {
  // Pollinations.ai — 100% free, no API key needed
  const encoded = encodeURIComponent(prompt + ', professional blog featured image, high quality, photorealistic')
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true`
}
