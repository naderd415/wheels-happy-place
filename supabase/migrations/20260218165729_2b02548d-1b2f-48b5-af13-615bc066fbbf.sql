
-- =============================================
-- FIX 1: Make all public SELECT policies PERMISSIVE
-- =============================================

-- Drop ALL existing policies on public tables
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Stats viewable by admins" ON public.visitor_stats;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

-- Ensure RLS is enabled
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- PERMISSIVE public SELECT policies
CREATE POLICY "public_read_categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "public_read_products" ON public.products FOR SELECT USING (true);
CREATE POLICY "public_read_site_settings" ON public.site_settings FOR SELECT USING (true);

-- Admin management policies (PERMISSIVE by default)
CREATE POLICY "admin_manage_categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_manage_products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_manage_site_settings" ON public.site_settings FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Visitor stats: admin read + track_visit function handles inserts via SECURITY DEFINER
CREATE POLICY "admin_read_stats" ON public.visitor_stats FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_manage_stats" ON public.visitor_stats FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User roles: users can read own
CREATE POLICY "read_own_roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- FIX 2: Create site_texts table for all site copy
-- =============================================
CREATE TABLE IF NOT EXISTS public.site_texts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text_key text NOT NULL UNIQUE,
  text_value text NOT NULL DEFAULT '',
  description text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_site_texts" ON public.site_texts FOR SELECT USING (true);
CREATE POLICY "admin_manage_site_texts" ON public.site_texts FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed default texts
INSERT INTO public.site_texts (text_key, text_value, description) VALUES
  ('site_name_display', 'أوليكس موتورز', 'اسم الموقع المعروض في الهيدر والفوتر'),
  ('hero_badge', 'أوليكس موتورز', 'الشارة الصغيرة فوق عنوان الهيرو'),
  ('hero_title_line1', 'أقوى', 'السطر الأول من عنوان الهيرو'),
  ('hero_title_highlight', 'الموتوسيكلات', 'الكلمة المميزة بالتدرج في عنوان الهيرو'),
  ('hero_title_line2', 'بأفضل الأسعار', 'السطر الثاني من عنوان الهيرو'),
  ('hero_description', 'موتوسيكلات، اسكوترات، وتروسيكلات لجميع الأغراض. أحدث الموديلات بأسعار تنافسية مع خدمة ما بعد البيع.', 'وصف الهيرو'),
  ('hero_button', 'تصفح المعرض', 'نص زر الهيرو'),
  ('products_section_title', 'أحدث المنتجات', 'عنوان قسم المنتجات في الصفحة الرئيسية'),
  ('footer_description', 'أحدث الموديلات بأسعار تنافسية مع خدمة ما بعد البيع', 'وصف الفوتر'),
  ('footer_sections_title', 'الأقسام', 'عنوان قسم الأقسام في الفوتر'),
  ('footer_contact_title', 'تواصل معنا', 'عنوان قسم التواصل في الفوتر'),
  ('footer_facebook_label', 'فيسبوك', 'نص رابط الفيسبوك في الفوتر'),
  ('footer_copyright', '© {year} {site_name}. جميع الحقوق محفوظة.', 'نص حقوق النشر - {year} للسنة و {site_name} لاسم الموقع'),
  ('nav_home', 'الرئيسية', 'رابط الرئيسية في القائمة'),
  ('nav_shop', 'المعرض', 'رابط المعرض في القائمة'),
  ('made_by', 'صُنع بواسطة أوليكس موتورز', 'نص "صنع بواسطة" في أسفل الموقع')
ON CONFLICT (text_key) DO NOTHING;
