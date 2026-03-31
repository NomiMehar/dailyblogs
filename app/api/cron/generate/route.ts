import { NextRequest, NextResponse } from 'next/server'

// This route is called by Vercel Cron at 6AM, 12PM, 4PM, 9PM daily
// vercel.json: { "crons": [{ "path": "/api/cron/generate", "schedule": "0 6,12,16,21 * * *" }] }

export async function GET(req: NextRequest) {
  // Verify this is called from Vercel cron (or our own secret)
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Call the main generate endpoint
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret}`,
      },
      body: JSON.stringify({}), // Empty = auto-pick trending topic
    })

    const data = await res.json()

    if (data.success) {
      console.log(`[Cron] Generated: ${data.post.title}`)
      return NextResponse.json({ success: true, title: data.post.title, seoScore: data.post.seo_score })
    } else {
      return NextResponse.json({ success: false, error: data.error }, { status: 500 })
    }
  } catch (err: any) {
    console.error('[Cron] Error:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
