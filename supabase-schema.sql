-- Run this in your Supabase SQL editor

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Technology',
  tags TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  featured_image TEXT,
  image_alt TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','scheduled','failed')),
  seo_score INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  source_topic TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trending topics queue
CREATE TABLE trending_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  source TEXT NOT NULL,
  category TEXT,
  score INTEGER DEFAULT 0,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('posts_per_day', '4'),
  ('min_seo_score', '85'),
  ('categories', '["Technology","AI & ML","Finance","Business","Health","Gaming","Crypto","Science"]'),
  ('post_schedule', '["06:00","12:00","16:00","21:00"]'),
  ('auto_publish', 'true'),
  ('word_count_target', '3000'),
  ('adsense_enabled', 'true'),
  ('affiliate_enabled', 'true');

-- Indexes for performance
CREATE INDEX posts_status_idx ON posts(status);
CREATE INDEX posts_category_idx ON posts(category);
CREATE INDEX posts_published_at_idx ON posts(published_at DESC);
CREATE INDEX posts_slug_idx ON posts(slug);
CREATE INDEX trending_used_idx ON trending_topics(used, created_at DESC);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public read published posts" ON posts
  FOR SELECT USING (status = 'published');

-- Service role has full access (used by API routes)
CREATE POLICY "Service role full access posts" ON posts
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access topics" ON trending_topics
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access analytics" ON analytics
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access settings" ON settings
  USING (auth.role() = 'service_role');
