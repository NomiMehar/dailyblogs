// lib/ai-engine.ts
// Multi-provider AI engine — tries providers in order until one works:
//   1. Groq       (FREE — Llama 3.3 70B)  → console.groq.com
//   2. OpenRouter (FREE tier)             → openrouter.ai
//   3. Anthropic  (paid ~$0.05/article)   → console.anthropic.com
//   4. Ollama     (FREE local)            → ollama.ai

export interface GeneratedPost {
  title: string; slug: string; excerpt: string; content: string
  metaTitle: string; metaDescription: string
  tags: string[]; keywords: string[]; category: string
  imagePrompt: string; seoScore: number; wordCount: number
}

function detectCategory(topic: string): string {
  const t = topic.toLowerCase()
  if (t.match(/ai|ml|gpt|llm|claude|openai|machine learning|neural/)) return 'AI & ML'
  if (t.match(/crypto|bitcoin|ethereum|blockchain|defi|nft/)) return 'Crypto'
  if (t.match(/stock|invest|money|finance|economy|bank|revenue/)) return 'Finance'
  if (t.match(/startup|business|entrepreneur|market|sales/)) return 'Business'
  if (t.match(/health|medical|fitness|diet|workout|mental/)) return 'Health'
  if (t.match(/game|gaming|xbox|playstation|steam|esport/)) return 'Gaming'
  if (t.match(/science|space|nasa|physics|biology|research/)) return 'Science'
  return 'Technology'
}

function buildPrompts(topic: string, category: string) {
  const year = new Date().getFullYear()
  const system = `You are an expert SEO content writer. Write engaging, authoritative blog articles.
CRITICAL: Respond with valid JSON ONLY. No markdown. No text outside the JSON object.`

  const user = `Write a complete SEO blog post about: "${topic}"

Return ONLY this JSON (no other text, no markdown fences):
{
  "title": "H1 title with keyword, max 60 chars",
  "metaTitle": "SEO title 55-60 chars",
  "metaDescription": "Meta description 150-160 chars with CTA",
  "excerpt": "2-3 sentence preview summary",
  "category": "${category}",
  "keywords": ["primary keyword","secondary 1","secondary 2","long tail 1","long tail 2"],
  "tags": ["tag1","tag2","tag3","tag4","tag5"],
  "imagePrompt": "Detailed image generation prompt for featured image",
  "content": "<h2>Introduction</h2><p>Hook paragraph...</p><h2>Section 1</h2><p>...</p>... (2000+ words of HTML)"
}

Content requirements:
- 2000-3000 words total HTML
- 5-6 <h2> sections, 3-4 <h3> subsections
- Proper <p>, <ul><li>, <strong>, <blockquote> tags
- FAQ at end: <div class="faq-item"><h3 class="faq-q">Q?</h3><p class="faq-a">A.</p></div>
- Natural keyword usage, year ${year} where relevant
- Genuinely helpful content`

  return { system, user }
}

async function callGroq(system: string, user: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 8000,
      temperature: 0.7,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  })
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`)
  const d = await res.json()
  return d.choices[0].message.content
}

async function callOpenRouter(system: string, user: string): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000',
      'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'AutoBlog AI',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      max_tokens: 8000,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  })
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`)
  const d = await res.json()
  return d.choices[0].message.content
}

async function callAnthropic(system: string, user: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`)
  const d = await res.json()
  return d.content[0].text
}

async function callOllama(system: string, user: string): Promise<string> {
  const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      stream: false,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  })
  if (!res.ok) throw new Error(`Ollama ${res.status}`)
  const d = await res.json()
  return d.message.content
}

function parseJSON(raw: string): any {
  let text = raw.trim()
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/,'').trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object in response')
  return JSON.parse(text.slice(start, end + 1))
}

export async function generateBlogPost(topic: string): Promise<GeneratedPost> {
  const category = detectCategory(topic)
  const { system, user } = buildPrompts(topic, category)

  const providers = [
    process.env.GROQ_API_KEY        && { name: 'Groq',        fn: () => callGroq(system, user) },
    process.env.OPENROUTER_API_KEY  && { name: 'OpenRouter',  fn: () => callOpenRouter(system, user) },
    process.env.ANTHROPIC_API_KEY   && { name: 'Anthropic',   fn: () => callAnthropic(system, user) },
    process.env.OLLAMA_BASE_URL     && { name: 'Ollama',      fn: () => callOllama(system, user) },
  ].filter(Boolean) as Array<{ name: string; fn: () => Promise<string> }>

  if (providers.length === 0) {
    throw new Error(
      'No AI provider configured. Add one of these to .env.local:\n' +
      '  GROQ_API_KEY=...        (FREE — get at console.groq.com)\n' +
      '  OPENROUTER_API_KEY=...  (FREE — get at openrouter.ai)\n' +
      '  ANTHROPIC_API_KEY=...   (paid — console.anthropic.com)\n' +
      '  OLLAMA_BASE_URL=http://localhost:11434  (free local)'
    )
  }

  let lastError: Error | null = null
  for (const p of providers) {
    try {
      console.log(`[AI] Trying ${p.name}...`)
      const raw = await p.fn()
      const parsed = parseJSON(raw)
      const slugify = (s: string) =>
        s.toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/[\s_-]+/g,'-').replace(/^-+|-+$/g,'')
      const wordCount = (parsed.content||'').replace(/<[^>]*>/g,'').split(/\s+/).filter(Boolean).length
      const seoScore = calculateSeoScore(parsed)
      console.log(`[AI] ✓ ${p.name}: "${parsed.title}" (${wordCount}w, SEO:${seoScore})`)
      return { ...parsed, slug: slugify(parsed.title || topic), seoScore, wordCount }
    } catch (err: any) {
      console.error(`[AI] ${p.name} failed: ${err.message}`)
      lastError = err
    }
  }
  throw new Error(`All AI providers failed. Last: ${lastError?.message}`)
}

function calculateSeoScore(post: any): number {
  let score = 0
  const c = post.content || '', t = post.title || '', kw = post.keywords?.[0] || ''
  if (t.length >= 30 && t.length <= 65) score += 10
  if (kw && t.toLowerCase().includes(kw.toLowerCase())) score += 10
  if (post.metaTitle?.length >= 50 && post.metaTitle?.length <= 65) score += 10
  if (post.metaDescription?.length >= 140 && post.metaDescription?.length <= 165) score += 10
  const wc = c.replace(/<[^>]*>/g,'').split(/\s+/).filter(Boolean).length
  if (wc >= 1500) score += 10
  if (wc >= 2500) score += 10
  if (c.includes('<h2>') || c.includes('<h2 ')) score += 10
  if (c.toLowerCase().includes('faq')) score += 10
  if (post.keywords?.length >= 4) score += 10
  if (post.tags?.length >= 3) score += 10
  return Math.min(100, score)
}

export function getImageUrl(prompt: string, width = 1200, height = 630): string {
  const encoded = encodeURIComponent((prompt||'technology blog')+', professional blog featured image, high quality, photorealistic')
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true`
}
