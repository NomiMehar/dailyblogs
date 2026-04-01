import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { postId, title } = await req.json()
  if (!postId || !title) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  try {
    // Use Claude to regenerate just the SEO fields
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Generate SEO meta fields for a blog post titled: "${title}"
Return ONLY valid JSON (no markdown) with these exact fields:
{
  "meta_title": "SEO title 50-60 chars with primary keyword",
  "meta_description": "Compelling description 150-160 chars with keyword + CTA"
}`
        }],
      }),
    })

    const data = await response.json()
    const text = data.content[0].text.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim()
    const seoFields = JSON.parse(text)

    const { error } = await supabaseAdmin
      .from('posts')
      .update({
        meta_title: seoFields.meta_title,
        meta_description: seoFields.meta_description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true, updated: seoFields })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
