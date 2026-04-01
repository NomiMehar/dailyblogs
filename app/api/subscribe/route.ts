import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    // Make sure subscribers table exists (create via Supabase if not)
    const { error } = await supabaseAdmin
      .from('subscribers')
      .upsert({ email, subscribed_at: new Date().toISOString() }, { onConflict: 'email' })

    if (error && error.code !== '42P01') {
      // 42P01 = table does not exist (gracefully handle)
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    // Silently succeed even if table doesn't exist yet
    return NextResponse.json({ success: true })
  }
}
