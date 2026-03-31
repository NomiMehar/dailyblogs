import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME,
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
}

export const revalidate = 300 // Revalidate every 5 minutes

async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select('id,title,slug,excerpt,category,tags,featured_image,published_at,views,seo_score,word_count')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(30)
  return data || []
}

const CATEGORIES = ['All', 'Technology', 'AI & ML', 'Finance', 'Business', 'Health', 'Gaming', 'Crypto', 'Science']

export default async function HomePage() {
  const posts = await getPosts()
  const featured = posts.slice(0, 3)
  const latest = posts.slice(3)
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AutoBlog AI'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'var(--amber)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✦</div>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 700, color: 'var(--amber)' }}>{siteName}</span>
          </Link>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {CATEGORIES.slice(1, 6).map(cat => (
              <Link key={cat} href={`/blog/category/${cat.toLowerCase().replace(' & ', '-')}`}
                style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        {/* Hero - Featured Posts */}
        {featured.length > 0 && (
          <section style={{ marginBottom: 64 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
              {/* Main featured */}
              {featured[0] && (
                <Link href={`/blog/${featured[0].slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--card)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', transition: 'border-color .2s' }}
                    className="hover-card">
                    <div style={{ height: 280, background: 'linear-gradient(135deg, #1a1a30, #2a1040)', position: 'relative', overflow: 'hidden' }}>
                      {featured[0].featured_image && (
                        <Image src={featured[0].featured_image} alt={featured[0].title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />
                      )}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,.9), transparent)' }} />
                      <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                        <span style={{ background: 'var(--amber)', color: '#0A0A0F', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
                          {featured[0].category}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: 20 }}>
                      <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text)', marginBottom: 10 }}>
                        {featured[0].title}
                      </h2>
                      <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12 }}>{featured[0].excerpt}</p>
                      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text2)' }}>
                        <span>{formatDistanceToNow(new Date(featured[0].published_at))} ago</span>
                        <span>·</span>
                        <span>{Math.ceil((featured[0].word_count || 1500) / 200)} min read</span>
                        <span>·</span>
                        <span>{(featured[0].views || 0).toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Side featured */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {featured.slice(1, 3).map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', flex: 1 }}>
                    <div style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', height: 130 }}>
                      <div style={{ width: 130, background: 'linear-gradient(135deg,#1a1a30,#2a1040)', flexShrink: 0, position: 'relative' }}>
                        {post.featured_image && (
                          <Image src={post.featured_image} alt={post.title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />
                        )}
                      </div>
                      <div style={{ padding: '12px 14px', flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 9, color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{post.category}</span>
                        <h3 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: 'var(--text)', margin: '6px 0 8px' }}>{post.title}</h3>
                        <span style={{ fontSize: 11, color: 'var(--text2)' }}>{formatDistanceToNow(new Date(post.published_at))} ago</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <Link key={cat} href={cat === 'All' ? '/blog' : `/blog/category/${cat.toLowerCase().replace(' & ', '-')}`}
              style={{ padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500, textDecoration: 'none', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Latest Posts Grid */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, color: 'var(--text)' }}>Latest Articles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {latest.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 160, background: 'linear-gradient(135deg,#1a1a30,#2a1040)', position: 'relative' }}>
                    {post.featured_image && (
                      <Image src={post.featured_image} alt={post.title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />
                    )}
                  </div>
                  <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 9, color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{post.category}</span>
                    <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: 'var(--text)', margin: '8px 0 10px', flex: 1 }}>{post.title}</h3>
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
        </section>

        {/* Newsletter CTA */}
        <section style={{ margin: '64px 0', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '48px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 12 }}>Stay Ahead of the Curve</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Get the latest AI-curated insights delivered to your inbox daily.
          </p>
          {/* <form style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto' }} onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.com"
              style={{ flex: 1, padding: '10px 16px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none' }} />
            <button type="submit"
              style={{ padding: '10px 20px', background: 'var(--amber)', color: '#0A0A0F', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Subscribe Free
            </button>
          </form> */}
        </section>

      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text2)', fontSize: 13 }}>
          © {new Date().getFullYear()} {siteName} · Powered by AI · All articles are AI-generated and fact-checked
        </p>
      </footer>
    </div>
  )
}
