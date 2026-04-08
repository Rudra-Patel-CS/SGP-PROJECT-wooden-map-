-- Run this in your Supabase SQL editor (Dashboard > SQL Editor)

-- 1. Add video_url column if it doesn't exist
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS video_url text;

-- 2. Add published column if it doesn't exist
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;

-- 3. Mark all existing blogs as published
UPDATE blogs SET published = true WHERE published IS NULL;

-- 4. Allow public read access (disable RLS or add policy)
-- Option A: Disable RLS on blogs table entirely (simplest)
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;

-- Option B (alternative): Keep RLS but allow public reads
-- ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public can read published blogs" ON blogs FOR SELECT USING (published = true);
-- CREATE POLICY "Service role full access" ON blogs USING (auth.role() = 'service_role');
