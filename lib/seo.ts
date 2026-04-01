// lib/seo.ts

export function generateSchemaMarkup(post: {
  title: string
  excerpt: string
  slug: string
  published_at: string
  updated_at: string
  featured_image: string
  category: string
  tags: string[]
  content: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Blogs Dairy'
  const postUrl = `${siteUrl}/blog/${post.slug}`

  // Extract FAQ items from content
  const faqMatches = Array.from(post.content?.matchAll(/<h3 class="faq-q">([\s\S]*?)<\/h3>\s*<p class="faq-a">([\s\S]*?)<\/p>/g) || [])
  const faqSchema = faqMatches.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage', 
    mainEntity: faqMatches.map(m => ({
      '@type': 'Question',
      name: m[1].replace(/<[^>]*>/g, ''),
      acceptedAnswer: {
        '@type': 'Answer',
        text: m[2].replace(/<[^>]*>/g, ''),
      },
    })),
  } : null

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: siteName, url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    articleSection: post.category,
    keywords: post.tags.join(', '),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.category, item: `${siteUrl}/blog/category/${post.category.toLowerCase()}` },
      { '@type': 'ListItem', position: 4, name: post.title, item: postUrl },
    ],
  }

  return { articleSchema, breadcrumbSchema, faqSchema }
}

export async function pingGoogleIndexing(url: string) {
  try {
    // Ping Google to index the new URL
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`)
  } catch {}
}

export function generateSitemap(posts: Array<{ slug: string; updated_at: string; published_at: string }>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  const staticPages = [
    { url: siteUrl, priority: '1.0', changefreq: 'daily' },
    { url: `${siteUrl}/blog`, priority: '0.9', changefreq: 'hourly' },
  ]

  const postUrls = posts.map(p => ({
    url: `${siteUrl}/blog/${p.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: p.updated_at || p.published_at,
  }))

  const allUrls = [...staticPages, ...postUrls]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.url}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    ${(u as any).lastmod ? `<lastmod>${new Date((u as any).lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`
}
