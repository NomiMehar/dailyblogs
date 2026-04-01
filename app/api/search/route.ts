import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const { data } = await supabase
    .from('posts')
    .select('id,title,slug,excerpt,category,published_at')
    .eq('status', 'published')
    .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
    .order('published_at', { ascending: false })
    .limit(10)

  return NextResponse.json({ results: data || [] })
}
