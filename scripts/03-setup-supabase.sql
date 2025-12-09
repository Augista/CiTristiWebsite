-- Create users table (extension of Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id BIGSERIAL PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  district TEXT,
  property_type TEXT NOT NULL,
  price BIGINT NOT NULL,
  size_sqm INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  featured_image_url TEXT,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  contact_phone TEXT,
  contact_email TEXT,
  listing_status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for properties table
CREATE POLICY "Anyone can read properties" ON public.properties
  FOR SELECT USING (TRUE);

CREATE POLICY "Admin can create properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = admin_id AND EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admin can update own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = admin_id AND EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admin can delete own properties" ON public.properties
  FOR DELETE USING (auth.uid() = admin_id AND EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('properties', 'properties', TRUE)
ON CONFLICT DO NOTHING;

-- RLS Policy for storage
CREATE POLICY "Public can read property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'properties');

CREATE POLICY "Admin can upload property images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'properties' AND
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = TRUE
    )
  );
