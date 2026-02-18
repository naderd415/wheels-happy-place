
-- Add show_in_slider flag to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS show_in_slider boolean NOT NULL DEFAULT false;

-- Create homepage_sections table for dynamic sections
CREATE TABLE public.homepage_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  section_type text NOT NULL DEFAULT 'custom',
  filter_type text NOT NULL DEFAULT 'all',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public_read_homepage_sections" ON public.homepage_sections FOR SELECT USING (true);

-- Admin manage
CREATE POLICY "admin_manage_homepage_sections" ON public.homepage_sections FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed default sections
INSERT INTO public.homepage_sections (title, slug, section_type, filter_type, sort_order, is_active) VALUES
  ('أحدث المنتجات', 'latest', 'auto', 'latest', 1, true),
  ('عروض وخصومات', 'offers', 'auto', 'discounted', 2, true),
  ('جاء حديثاً', 'new-arrivals', 'auto', 'newest', 3, false);
