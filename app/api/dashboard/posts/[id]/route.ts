import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface Params { params: { id: string } }

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await supabaseAdmin.from('posts').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const body = await req.json()
  const allowed = ['status', 'title', 'content', 'meta_title', 'meta_description', 'category', 'tags']
  const update: Record<string, any> = { updated_at: new Date().toISOString() }

  for (const key of allowed) {
    if (key in body) update[key] = body[key]
  }

  // If publishing, set published_at
  if (body.status === 'published' && !body.published_at) {
    update.published_at = new Date().toISOString()
  }

  const { data, error } = await supabaseAdmin.from('posts').update(update).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, post: data })
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { data, error } = await supabaseAdmin.from('posts').select('*').eq('id', params.id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}
