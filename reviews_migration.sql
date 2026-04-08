-- SQL for Supabase Dashboard (SQL Editor)
-- This creates the reviews table and its security policies

CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(product_id, user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read reviews for products
CREATE POLICY "Public Read Access" 
ON reviews FOR SELECT 
USING (true);

-- Policy: Authenticated users can insert their own reviews
CREATE POLICY "Authenticated Insert" 
ON reviews FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Admin service role (used in API) has full access
-- Supabase automatically grants full access to service_role, no policy needed
-- but good to know it's there.
