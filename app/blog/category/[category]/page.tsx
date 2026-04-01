import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props { params: { category: string } }

const CATEGORY_MAP: Record<string, string> = {
  'technology': 'Technology', 'ai-ml': 'AI & ML',
  'finance': 'Finance', 'business': 'Business',
  'health': 'Health', 'gaming': 'Gaming',
  'crypto': 'Crypto', 'science': 'Science',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = CATEGORY_MAP[params.category]
  if (!cat) return { title: 'Not Found' }
  return {
    title: `${cat} Articles`,
    description: `Browse all ${cat} articles — AI-generated, SEO-optimized content updated daily.`,
  }
}

export const revalidate = 600

export default async function CategoryPage({ params }: Props) {
  const cat = CATEGORY_MAP[params.category]
  if (!cat) notFound()

  const { data: posts } = await supabase
    .from('posts')
    .select('id,title,slug,excerpt,category,featured_image,published_at,views,word_count')
    .eq('status', 'published')
    .eq('category', cat)
    .order('published_at', { ascending: false })
    .limit(30)

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Blogs Dairy'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: 'var(--amber)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✦</div>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, fontWeight: 700, color: 'var(--amber)' }}>{siteName}</span>
          </Link>
          <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>← All Articles</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{ background: 'var(--amber)', color: '#0A0A0F', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>{cat}</span>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', fontWeight: 700, marginTop: 12, marginBottom: 8 }}>{cat} Articles</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>{posts?.length || 0} articles · Updated daily by AI</p>
        </div>

        {!posts || posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text2)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p>No articles in this category yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 160, background: 'linear-gradient(135deg,#1a1a30,#2a1040)', position: 'relative' }}>
                    {post.featured_image && <Image src={post.featured_image} alt={post.title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />}
                  </div>
                  <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: 'var(--text)', marginBottom: 8, flex: 1 }}>{post.title}</h2>
                    <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text2)' }}>
                      <span>{formatDistanceToNow(new Date(post.published_at))} ago</span>
                      <span>{Math.ceil((post.word_count || 1500) / 200)} min read</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text2)', fontSize: 12 }}>© {new Date().getFullYear()} {siteName} · AI-generated content</p>
      </footer>
    </div>
  )
}
