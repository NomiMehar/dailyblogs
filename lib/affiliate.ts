// lib/affiliate.ts
// Auto-inserts Amazon affiliate links into post content

const AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || 'autoblogai-20'

// Keyword → Amazon search URL mapping
const AFFILIATE_KEYWORDS: Record<string, string> = {
  'laptop': 'laptops',
  'phone': 'smartphones',
  'headphones': 'headphones',
  'keyboard': 'mechanical+keyboards',
  'monitor': 'computer+monitors',
  'webcam': 'webcams',
  'microphone': 'microphones',
  'standing desk': 'standing+desks',
  'chair': 'office+chairs',
  'gpu': 'graphics+cards',
  'cpu': 'processors',
  'router': 'wifi+routers',
  'smartwatch': 'smartwatches',
  'tablet': 'tablets',
  'speaker': 'bluetooth+speakers',
  'camera': 'digital+cameras',
  'book': 'books',
  'course': 'online+courses',
  'software': 'software',
  'tool': 'tools',
}

export function injectAffiliateLinks(content: string, category: string): string {
  if (!content) return content

  let modified = content
  let injectionCount = 0
  const maxInjections = 3

  for (const [keyword, searchTerm] of Object.entries(AFFILIATE_KEYWORDS)) {
    if (injectionCount >= maxInjections) break

    const regex = new RegExp(`\\b(${keyword}s?)\\b(?![^<]*>)(?![^<]*</a>)`, 'gi')
    if (regex.test(modified)) {
      const affiliateUrl = `https://www.amazon.com/s?k=${searchTerm}&tag=${AFFILIATE_TAG}`
      modified = modified.replace(
        new RegExp(`\\b(${keyword}s?)\\b(?![^<]*>)(?![^<]*</a>)`, 'i'),
        `<a href="${affiliateUrl}" target="_blank" rel="noopener nofollow sponsored" style="color:var(--amber);text-decoration:underline;text-underline-offset:3px">$1</a>`
      )
      injectionCount++
    }
  }

  return modified
}

export function getAffiliateUrl(searchTerm: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}&tag=${AFFILIATE_TAG}`
}
