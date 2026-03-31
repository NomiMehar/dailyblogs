import { NextRequest, NextResponse } from 'next/server'
import { generateBlogPost, getImageUrl } from '@/lib/ai-engine'
import { getAllTrendingTopics, SEED_TOPICS } from '@/lib/trending'
import { supabaseAdmin } from '@/lib/supabase'
import { pingGoogleIndexing } from '@/lib/seo'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    let topic = body.topic as string | undefined

    // If no topic given, pick from trending
    if (!topic) {
      const [trending] = await Promise.allSettled([getAllTrendingTopics()])
      const topics = trending.status === 'fulfilled' ? trending.value : []

      if (topics.length > 0) {
        // Skip topics already used recently
        const { data: recentTopics } = await supabaseAdmin
          .from('posts')
          .select('source_topic')
          .order('created_at', { ascending: false })
          .limit(50)

        const usedTopics = new Set((recentTopics || []).map(p => p.source_topic?.substring(0, 30)))
        const available = topics.filter(t => !usedTopics.has(t.topic.substring(0, 30)))
        topic = available.length > 0 ? available[0].topic : SEED_TOPICS[Math.floor(Math.random() * SEED_TOPICS.length)]
      } else {
        topic = SEED_TOPICS[Math.floor(Math.random() * SEED_TOPICS.length)]
      }
    }

    console.log(`Generating post for: ${topic}`)

    // Generate the blog post content using Claude
    const generated = await generateBlogPost(topic)

    // Generate image URL from Pollinations (free, no API key)
    const imageUrl = getImageUrl(generated.imagePrompt || generated.title)

    // Make slug unique if needed
    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('slug')
      .eq('slug', generated.slug)
      .single()

    const finalSlug = existing ? `${generated.slug}-${Date.now()}` : generated.slug
    const now = new Date().toISOString()

    // Save to Supabase
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        title: generated.title,
        slug: finalSlug,
        excerpt: generated.excerpt,
        content: generated.content,
        category: generated.category,
        tags: generated.tags,
        keywords: generated.keywords,
        meta_title: generated.metaTitle,
        meta_description: generated.metaDescription,
        featured_image: imageUrl,
        image_alt: generated.title,
        status: 'published',
        seo_score: generated.seoScore,
        word_count: generated.wordCount,
        published_at: now,
        source_topic: topic,
        views: 0,
        clicks: 0,
        revenue: 0,
      })
      .select()
      .single()

    if (error) throw new Error(`DB error: ${error.message}`)

    // Track in analytics
    await supabaseAdmin.from('analytics').insert({
      post_id: post.id,
      event_type: 'generated',
      value: 1,
    })

    // Ping Google Search Console (fire and forget)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
    pingGoogleIndexing(`${siteUrl}/sitemap.xml`).catch(() => {})

    return NextResponse.json({ success: true, post })

  } catch (err: any) {
    console.error('Generate error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
