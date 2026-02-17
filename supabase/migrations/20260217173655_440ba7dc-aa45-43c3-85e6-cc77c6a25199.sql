
-- Fix RLS policies: drop restrictive ones and recreate as permissive

-- Categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site settings
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add site_type column to site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS site_type text NOT NULL DEFAULT 'both';
-- site_type values: 'gasoline', 'electric', 'both'

-- Add hero_product_id to site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL;

-- Add google_drive_url to site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS google_drive_url text;

-- Add location_url to site_settings  
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS location_url text;

-- Create visitor stats table
CREATE TABLE IF NOT EXISTS public.visitor_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  visits integer NOT NULL DEFAULT 0,
  unique_visitors integer NOT NULL DEFAULT 0,
  UNIQUE(date)
);

ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stats viewable by admins" ON public.visitor_stats FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Stats insertable by anyone" ON public.visitor_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Stats updatable by anyone" ON public.visitor_stats FOR UPDATE USING (true);

-- Add sub-categories (economic, mid, sport) support via a tier column
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tier text DEFAULT 'mid';
-- tier values: 'economic', 'mid', 'sport'
