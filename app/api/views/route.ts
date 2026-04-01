import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

    // Increment view count atomically
    const { error } = await supabaseAdmin.rpc('increment_views', { post_slug: slug })

    // Fallback if RPC not set up
    if (error) {
      const { data: post } = await supabaseAdmin.from('posts').select('id,views').eq('slug', slug).single()
      if (post) {
        await supabaseAdmin.from('posts').update({ views: (post.views || 0) + 1 }).eq('id', post.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
