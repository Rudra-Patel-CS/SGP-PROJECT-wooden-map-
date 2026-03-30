-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This adds a specifications JSONB column to the products table

ALTER TABLE products
ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{
  "Map Type": "Physical",
  "Size": "40 X 24 INCH",
  "Lamination": "Waterproof",
  "Language": "English",
  "Material": "Wooden",
  "Usage": "Home, Coaching, Office, School",
  "Color": "MULTI COLOR",
  "Surface Finish": "POLISH",
  "Service Duration": "WITH INSTALLATION",
  "Capacity": "10 YEAR AND MORE",
  "Packaging Type": "BOX PACK"
}'::jsonb;
