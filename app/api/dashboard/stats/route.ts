import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const [postsRes, viewsRes, seoRes, recentRes, scheduledRes] = await Promise.all([
      supabaseAdmin.from('posts').select('id', { count: 'exact' }),
      supabaseAdmin.from('posts').select('views').eq('status', 'published'),
      supabaseAdmin.from('posts').select('seo_score').eq('status', 'published'),
      supabaseAdmin.from('posts').select('id,title,slug,category,word_count,views,published_at').eq('status', 'published').order('published_at', { ascending: false }).limit(5),
      supabaseAdmin.from('posts').select('id,title,category,scheduled_for').eq('status', 'scheduled').order('scheduled_for').limit(10),
    ])

    const totalViews = (viewsRes.data || []).reduce((sum, p) => sum + (p.views || 0), 0)
    const avgSeo = seoRes.data?.length
      ? Math.round((seoRes.data || []).reduce((s, p) => s + (p.seo_score || 0), 0) / seoRes.data.length)
      : 0

    return NextResponse.json({
      totalPosts: postsRes.count || 0,
      publishedPosts: viewsRes.data?.length || 0,
      totalViews,
      avgSeoScore: avgSeo,
      recentPosts: recentRes.data || [],
      scheduledPosts: scheduledRes.data || [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
