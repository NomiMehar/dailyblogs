import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Browse all AI-generated articles covering technology, AI, finance, business and more.',
}

export const revalidate = 300

async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select('id,title,slug,excerpt,category,featured_image,published_at,views,word_count')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50)
  return data || []
}

export default async function BlogIndexPage() {
  const posts = await getPosts()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: 'var(--amber)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✦</div>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, fontWeight: 700, color: 'var(--amber)' }}>
              {process.env.NEXT_PUBLIC_SITE_NAME}
            </span>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>All Articles</h1>
        <p style={{ color: 'var(--text2)', marginBottom: 40 }}>{posts.length} articles published · Updated automatically by AI</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 160, background: 'linear-gradient(135deg,#1a1a30,#2a1040)', position: 'relative' }}>
                  {post.featured_image && <Image src={post.featured_image} alt={post.title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />}
                </div>
                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 9, color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{post.category}</span>
                  <h2 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: 'var(--text)', margin: '8px 0 auto' }}>{post.title}</h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text2)', marginTop: 12 }}>
                    <span>{formatDistanceToNow(new Date(post.published_at))} ago</span>
                    <span>{Math.ceil((post.word_count || 1500) / 200)} min read</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
