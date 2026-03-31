import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabaseAdmin.from('settings').select('*')
  const settings: Record<string, any> = {}
  for (const row of data || []) settings[row.key] = row.value
  return NextResponse.json(settings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const upserts = Object.entries(body).map(([key, value]) => ({
    key,
    value: typeof value === 'string' ? value : JSON.stringify(value),
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabaseAdmin.from('settings').upsert(upserts, { onConflict: 'key' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
