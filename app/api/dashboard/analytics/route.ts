import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data: topPosts } = await supabaseAdmin
    .from('posts')
    .select('id,title,slug,views,clicks,revenue,seo_score,category')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(10)

  const { data: totalStats } = await supabaseAdmin
    .from('posts')
    .select('views,clicks,revenue')
    .eq('status', 'published')

  const totals = (totalStats || []).reduce(
    (acc, p) => ({ views: acc.views + (p.views || 0), clicks: acc.clicks + (p.clicks || 0), revenue: acc.revenue + (p.revenue || 0) }),
    { views: 0, clicks: 0, revenue: 0 }
  )

  return NextResponse.json({ topPosts: topPosts || [], totals })
}
