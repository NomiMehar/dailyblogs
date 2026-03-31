import { supabase, supabaseAdmin } from '@/lib/supabase'
import { generateSchemaMarkup } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'
import { Metadata } from 'next'
import Script from 'next/script'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: post } = await supabase
    .from('posts')
    .select('title,meta_title,meta_description,featured_image,slug,tags,category,published_at')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!post) return { title: 'Not Found' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  return {
    title: post.meta_title || post.title,
    description: post.meta_description,
    keywords: post.tags?.join(', '),
    authors: [{ name: process.env.NEXT_PUBLIC_SITE_NAME }],
    openGraph: {
      type: 'article',
      title: post.meta_title || post.title,
      description: post.meta_description,
      images: post.featured_image ? [{ url: post.featured_image, width: 1200, height: 630 }] : [],
      publishedTime: post.published_at,
      tags: post.tags,
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description,
      images: post.featured_image ? [post.featured_image] : [],
    },
    alternates: { canonical: `/blog/${post.slug}` },
  }
}

export const revalidate = 3600

async function getPost(slug: string) {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data
}

async function getRelated(category: string, excludeSlug: string) {
  const { data } = await supabase
    .from('posts')
    .select('id,title,slug,category,featured_image,published_at,word_count')
    .eq('status', 'published')
    .eq('category', category)
    .neq('slug', excludeSlug)
    .order('published_at', { ascending: false })
    .limit(3)
  return data || []
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const related = await getRelated(post.category, post.slug)
  const { articleSchema, breadcrumbSchema, faqSchema } = generateSchemaMarkup(post)
  const readTime = Math.ceil((post.word_count || 1500) / 200)

  // Track view (fire and forget)
  supabaseAdmin.from('analytics').insert({ post_id: post.id, event_type: 'view' }).then(() => {})

  return (
    <>
      <Script id="schema-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="schema-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <Script id="schema-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

        {/* Nav */}
        <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 28, height: 28, background: 'var(--amber)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✦</div>
              <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, fontWeight: 700, color: 'var(--amber)' }}>
                {process.env.NEXT_PUBLIC_SITE_NAME}
              </span>
            </Link>
            <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>← All Articles</Link>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px 24px 0', fontSize: 12, color: 'var(--text2)' }}>
          <Link href="/" style={{ color: 'var(--text2)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/blog" style={{ color: 'var(--text2)', textDecoration: 'none' }}>Blog</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href={`/blog/category/${post.category.toLowerCase()}`} style={{ color: 'var(--amber)', textDecoration: 'none' }}>{post.category}</Link>
        </div>

        {/* Article */}
        <article style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 64px' }}>
          {/* Category & Meta */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ background: 'var(--amber)', color: '#0A0A0F', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--text)', marginBottom: 20 }}>
            {post.title}
          </h1>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text2)', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <span>📅 {format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
            <span>⏱ {readTime} min read</span>
            <span>📊 {post.word_count?.toLocaleString()} words</span>
            <span>👁 {post.views?.toLocaleString()} views</span>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 40, position: 'relative', aspectRatio: '16/9' }}>
              <Image
                src={post.featured_image}
                alt={post.image_alt || post.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}

          {/* AdSense - Top */}
          {process.env.NEXT_PUBLIC_ADSENSE_ID && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px', marginBottom: 32, textAlign: 'center', fontSize: 11, color: 'var(--text2)' }}>
              {/* Ad slot — replace with real adsbygoogle code */}
              Advertisement
            </div>
          )}

          {/* Excerpt / Intro callout */}
          <div style={{ background: 'var(--bg3)', borderLeft: '3px solid var(--amber)', padding: '16px 20px', borderRadius: '0 8px 8px 0', marginBottom: 32, fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text2)', fontStyle: 'italic' }}>
            {post.excerpt}
          </div>

          {/* Blog Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
              {post.tags.map((tag: string) => (
                <span key={tag} style={{ background: 'var(--bg3)', color: 'var(--text2)', fontSize: 12, padding: '4px 12px', borderRadius: 20, border: '1px solid var(--border)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* AdSense - Mid */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <div style={{ maxWidth: 800, margin: '-20px auto 40px', padding: '0 24px' }}>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, textAlign: 'center', fontSize: 11, color: 'var(--text2)' }}>
              Advertisement
            </div>
          </div>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 64px' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Related Articles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--card)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ height: 100, background: 'linear-gradient(135deg,#1a1a30,#2a1040)', position: 'relative' }}>
                      {r.featured_image && <Image src={r.featured_image} alt={r.title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />}
                    </div>
                    <div style={{ padding: 12 }}>
                      <span style={{ fontSize: 9, color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase' }}>{r.category}</span>
                      <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', lineHeight: 1.5, marginTop: 6 }}>{r.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: '24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text2)', fontSize: 12 }}>
            © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME} · AI-generated content
          </p>
        </footer>
      </div>
    </>
  )
}
