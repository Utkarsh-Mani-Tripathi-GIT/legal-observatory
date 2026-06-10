-- Supabase Database Schema
-- Place in Supabase SQL Editor to initialize database.

-- 1. Authors Table
CREATE TABLE IF NOT EXISTS authors (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to authors" ON authors FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to authors" ON authors FOR ALL USING (true) WITH CHECK (true); -- Custom admin keys bypass this or bypass via service role

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- 3. Articles Table
CREATE TABLE IF NOT EXISTS articles (
  slug TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('judgment', 'policy', 'research', 'opinion')),
  title TEXT NOT NULL,
  author_slug TEXT REFERENCES authors(slug) ON DELETE SET NULL,
  date TEXT NOT NULL,
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  content TEXT NOT NULL,
  raw_content TEXT,
  reading_time TEXT DEFAULT '5 min read',
  
  -- Judgment reviews
  case_summary TEXT,
  legal_principles TEXT[] DEFAULT '{}',
  statutes_referenced TEXT[] DEFAULT '{}',
  key_takeaways TEXT[] DEFAULT '{}',
  citation TEXT,
  
  -- Policy reviews
  policy_overview TEXT,
  policy_objectives TEXT[] DEFAULT '{}',
  legal_implications TEXT[] DEFAULT '{}',
  
  -- Research papers
  abstract TEXT,
  "references" TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to articles" ON articles FOR ALL USING (true) WITH CHECK (true);

-- 4. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email TEXT PRIMARY KEY,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to newsletter_subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read to newsletter_subscribers" ON newsletter_subscribers FOR SELECT USING (true);

-- 5. Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  slug TEXT PRIMARY KEY REFERENCES articles(slug) ON DELETE CASCADE,
  views INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read to page_views" ON page_views FOR SELECT USING (true);
CREATE POLICY "Allow public upsert to page_views" ON page_views FOR ALL WITH CHECK (true);

-- 6. Atomic Increment RPC Function
CREATE OR REPLACE FUNCTION increment_page_view(article_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_views INTEGER;
BEGIN
  INSERT INTO page_views (slug, views, updated_at)
  VALUES (article_slug, 1, NOW())
  ON CONFLICT (slug)
  DO UPDATE SET views = page_views.views + 1, updated_at = NOW()
  RETURNING views INTO new_views;
  
  RETURN new_views;
END;
$$;
