-- ============================================
-- Ci Tristi Property Database Schema
-- Comprehensive setup with all SRS features
-- ============================================

-- Drop old bucket if exists
DELETE FROM storage.buckets WHERE id = 'properties';

-- Create storage buckets for different property types
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('properties', 'properties', TRUE),
  ('thumbnails', 'thumbnails', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- BADGE SYSTEM TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.badges (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#FF6B6B',
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default badges
INSERT INTO public.badges (name, slug, color, description) VALUES
  ('Trending', 'trending', '#FF6B6B', 'Properties that are trending'),
  ('Cheap', 'cheap', '#FFD93D', 'Affordable properties'),
  ('Cozy', 'cozy', '#6BCB77', 'Comfortable living spaces'),
  ('Futuristic', 'futuristic', '#4D96FF', 'Modern and advanced properties')
ON CONFLICT DO NOTHING;

-- ============================================
-- TAGS/HASHTAGS SYSTEM TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#999999',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tags
INSERT INTO public.tags (name, slug, color) VALUES
  ('Citraland', 'citraland', '#6366F1'),
  ('Merr', 'merr', '#EC4899'),
  ('Promo', 'promo', '#F97316'),
  ('New Listing', 'new-listing', '#06B6D4'),
  ('Hot Deal', 'hot-deal', '#EF4444')
ON CONFLICT DO NOTHING;

-- ============================================
-- UPDATED PROPERTIES TABLE WITH NEW FIELDS
-- ============================================
CREATE TABLE IF NOT EXISTS public.properties (
  id BIGSERIAL PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  title TEXT NOT NULL UNIQUE,
  description TEXT,
  location TEXT NOT NULL,
  district TEXT,
  property_type TEXT NOT NULL, -- House, Apartment, Shophouse, etc
  listing_status TEXT DEFAULT 'available', -- available, sold, rented
  
  -- Pricing
  price BIGINT NOT NULL,
  currency TEXT DEFAULT 'IDR',
  
  -- Property Details
  size_sqm INTEGER,
  land_sqm INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  furnishing TEXT, -- unfurnished, semi-furnished, furnished
  
  -- Images
  featured_image_url TEXT,
  thumbnail_image_url TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb, -- Array of image objects {url, caption}
  
  -- Amenities & Features
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  facilities TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Tags & Badges
  badge_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  tag_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  
  -- Social Media & Contact
  tiktok_url TEXT,
  instagram_url TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  contact_name TEXT,
  
  -- Promotional
  is_promoted BOOLEAN DEFAULT FALSE,
  promotion_start_date TIMESTAMP WITH TIME ZONE,
  promotion_end_date TIMESTAMP WITH TIME ZONE,
  promotion_badge TEXT, -- custom badge for promotion
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PROMO/FEATURED LISTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.promo_listings (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SETTINGS/CONFIGURATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
  ('whatsapp_number', '+62812345678', 'Main WhatsApp contact number'),
  ('company_phone', '(031) 1234567', 'Company phone number'),
  ('company_email', 'info@citristi.com', 'Company email address'),
  ('instagram_url', 'https://instagram.com/citristi', 'Instagram profile URL'),
  ('tiktok_url', 'https://tiktok.com/@citristi', 'TikTok profile URL'),
  ('facebook_url', 'https://facebook.com/citristi', 'Facebook profile URL'),
  ('company_name', 'Ci Tristi Property', 'Company name'),
  ('company_address', 'Surabaya, Jawa Timur', 'Company address'),
  ('mortgage_calculator_enabled', 'true', 'Enable/disable mortgage calculator')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can read badges" ON public.badges FOR SELECT USING (TRUE);
CREATE POLICY "Public can read tags" ON public.tags FOR SELECT USING (TRUE);
CREATE POLICY "Public can read promo listings" ON public.promo_listings FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can read settings" ON public.settings FOR SELECT USING (TRUE);

-- Admin-only write access
CREATE POLICY "Admin can manage badges" ON public.badges
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admin can manage tags" ON public.tags
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admin can manage promo listings" ON public.promo_listings
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admin can manage settings" ON public.settings
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE));

-- Update properties table RLS
DROP POLICY IF EXISTS "Anyone can read properties" ON public.properties;
DROP POLICY IF EXISTS "Admin can create properties" ON public.properties;
DROP POLICY IF EXISTS "Admin can update own properties" ON public.properties;
DROP POLICY IF EXISTS "Admin can delete own properties" ON public.properties;

CREATE POLICY "Public can read properties" ON public.properties FOR SELECT USING (TRUE);
CREATE POLICY "Admin can create properties" ON public.properties FOR INSERT 
  WITH CHECK (auth.uid() = admin_id AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Admin can update properties" ON public.properties FOR UPDATE 
  USING (auth.uid() = admin_id AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Admin can delete properties" ON public.properties FOR DELETE 
  USING (auth.uid() = admin_id AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE));

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_properties_title ON public.properties(title);
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_listing_status ON public.properties(listing_status);
CREATE INDEX IF NOT EXISTS idx_promo_listings_active ON public.promo_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_listings_property_id ON public.promo_listings(property_id);
