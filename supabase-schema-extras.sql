-- Run this AFTER the main supabase-schema.sql
-- Adds subscribers table and view-count RPC function

-- Subscribers table (for newsletter)
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access subscribers" ON subscribers
  USING (auth.role() = 'service_role');

-- Atomic view increment function (avoids race conditions)
CREATE OR REPLACE FUNCTION increment_views(post_slug TEXT)
RETURNS void AS $$
  UPDATE posts SET views = COALESCE(views, 0) + 1
  WHERE slug = post_slug AND status = 'published';
$$ LANGUAGE sql;

-- Optional: Google Analytics events table
CREATE TABLE IF NOT EXISTS page_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  event TEXT NOT NULL,  -- 'view', 'click', 'share', 'subscribe'
  referrer TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX page_events_post_idx ON page_events(post_id);
CREATE INDEX page_events_created_idx ON page_events(created_at DESC);

ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access events" ON page_events
  USING (auth.role() = 'service_role');
