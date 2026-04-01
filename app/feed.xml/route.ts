import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Blogs Dairy'
  const siteDesc = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'AI-powered blog'

  const { data: posts } = await supabase
    .from('posts')
    .select('title,slug,excerpt,category,published_at,featured_image')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50)

  const items = (posts || []).map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteUrl}/blog/${p.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${p.slug}</guid>
      <description><![CDATA[${p.excerpt || ''}]]></description>
      <category>${p.category}</category>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      ${p.featured_image ? `<enclosure url="${p.featured_image}" type="image/jpeg" />` : ''}
    </item>`).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>${siteDesc}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
