import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Metadata } from 'next'
import SubscribeForm from './SubscribeForm'

export const metadata: Metadata = {
  title: { absolute: `${process.env.NEXT_PUBLIC_SITE_NAME || 'AutoBlog AI'} — AI-Powered Daily Blog` },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
}

export const revalidate = 300

async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select('id,title,slug,excerpt,category,featured_image,published_at,views,seo_score,word_count')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(30)
  return data || []
}

const CATEGORIES = ['Technology', 'AI & ML', 'Finance', 'Business', 'Health', 'Gaming', 'Crypto', 'Science']

export default async function HomePage() {
  const posts = await getPosts()
  const featured = posts.slice(0, 3)
  const latest = posts.slice(3)
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AutoBlog AI'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, background: 'var(--amber)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✦</div>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 700, color: 'var(--amber)' }}>{siteName}</span>
          </Link>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            {CATEGORIES.slice(0, 5).map(cat => (
              <Link key={cat} href={`/blog/category/${cat.toLowerCase().replace(' & ', '-')}`}
                style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', whiteSpace: 'nowrap' }}>{cat}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
            <Link href="/search" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>🔍</Link>
            <Link href="/about" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>About</Link>
            <Link href="/feed.xml" style={{ fontSize: 12, color: 'var(--amber)', textDecoration: 'none', border: '1px solid var(--amber)40', padding: '3px 10px', borderRadius: 6 }}>RSS</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        {featured.length > 0 && (
          <section style={{ marginBottom: 64 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
              {featured[0] && (
                <Link href={`/blog/${featured[0].slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--card)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ height: 300, background: 'linear-gradient(135deg,#1a1a30,#2a1040)', position: 'relative' }}>
                      {featured[0].featured_image && <Image src={featured[0].featured_image} alt={featured[0].title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,10,15,.9) 0%,transparent 60%)' }} />
                      <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                        <span style={{ background: 'var(--amber)', color: '#0A0A0F', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>{featured[0].category}</span>
                      </div>
                    </div>
                    <div style={{ padding: 22 }}>
                      <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text)', marginBottom: 10 }}>{featured[0].title}</h2>
                      <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 14 }}>{featured[0].excerpt}</p>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text2)' }}>
                        <span>{formatDistanceToNow(new Date(featured[0].published_at))} ago</span>
                        <span>·</span><span>{Math.ceil((featured[0].word_count || 1500) / 200)} min read</span>
                        <span>·</span><span>{(featured[0].views || 0).toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {featured.slice(1, 3).map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', flex: 1 }}>
                    <div style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', height: 145 }}>
                      <div style={{ width: 140, background: 'linear-gradient(135deg,#1a1a30,#2a1040)', flexShrink: 0, position: 'relative' }}>
                        {post.featured_image && <Image src={post.featured_image} alt={post.title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />}
                      </div>
                      <div style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 9, color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{post.category}</span>
                        <h3 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, color: 'var(--text)', margin: '6px 0 8px' }}>{post.title}</h3>
                        <span style={{ fontSize: 11, color: 'var(--text2)' }}>{formatDistanceToNow(new Date(post.published_at))} ago</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          <Link href="/blog" style={{ padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, textDecoration: 'none', background: 'var(--amber)', color: '#0A0A0F' }}>All</Link>
          {CATEGORIES.map(cat => (
            <Link key={cat} href={`/blog/category/${cat.toLowerCase().replace(' & ', '-')}`}
              style={{ padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500, textDecoration: 'none', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}>{cat}</Link>
          ))}
        </div>

        {latest.length > 0 && (
          <section>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Latest Articles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {latest.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 160, background: 'linear-gradient(135deg,#1a1a30,#2a1040)', position: 'relative' }}>
                      {post.featured_image && <Image src={post.featured_image} alt={post.title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />}
                    </div>
                    <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 9, color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{post.category}</span>
                      <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: 'var(--text)', margin: '8px 0 10px', flex: 1 }}>{post.title}</h3>
                      <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{post.excerpt}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text2)' }}>
                        <span>{formatDistanceToNow(new Date(post.published_at))} ago</span>
                        <span>{Math.ceil((post.word_count || 1500) / 200)} min read</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>✦</div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 12 }}>Your AI Blog is Ready</h2>
            <p style={{ color: 'var(--text2)', marginBottom: 28, fontSize: 15 }}>No posts yet. Go to the dashboard and generate your first article!</p>
            <Link href="/dashboard" style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--amber)', color: '#0A0A0F', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>Open Dashboard →</Link>
          </div>
        )}

        {posts.length > 0 && (
          <section style={{ margin: '64px 0 0', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '48px 40px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 10 }}>Stay Ahead of the Curve</h2>
            <p style={{ color: 'var(--text2)', marginBottom: 24, maxWidth: 420, margin: '0 auto 24px', fontSize: 15, lineHeight: 1.7 }}>Get the latest insights delivered daily. No spam, unsubscribe anytime.</p>
           <SubscribeForm />
          </section>
        )}
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: '32px 24px', marginTop: 64 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>© {new Date().getFullYear()} {siteName} · AI-generated content</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['About','/about'],['Privacy','/privacy'],['RSS','/feed.xml'],['Dashboard','/dashboard']].map(([l,h])=>(
              <Link key={h} href={h} style={{ fontSize: 12, color: 'var(--text2)', textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
