import { NextRequest, NextResponse } from 'next/server'
import { getAllTrendingTopics } from '@/lib/trending'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const topics = await getAllTrendingTopics()

    if (topics.length === 0) {
      return NextResponse.json({ success: false, message: 'No topics found' })
    }

    // Upsert into DB
    const rows = topics.slice(0, 30).map(t => ({
      topic: t.topic,
      source: t.source,
      category: t.category,
      score: t.score,
      used: false,
    }))

    const { error } = await supabaseAdmin
      .from('trending_topics')
      .insert(rows)

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true, count: topics.length, topics: topics.slice(0, 10) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET current trending topics (for dashboard display)
export async function POST() {
  const topics = await getAllTrendingTopics()
  return NextResponse.json({ topics: topics.slice(0, 20) })
}
