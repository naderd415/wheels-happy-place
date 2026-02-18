
-- Add new columns to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS hero_image_url text,
ADD COLUMN IF NOT EXISTS theme_mode text NOT NULL DEFAULT 'dark',
ADD COLUMN IF NOT EXISTS phone2 text,
ADD COLUMN IF NOT EXISTS phone3 text;

-- Create site_features table for "Why choose us" section
CREATE TABLE public.site_features (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon_name text NOT NULL DEFAULT 'Star',
  sort_order integer DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  category_slug text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_site_features" ON public.site_features
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_site_features" ON public.site_features
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default features
INSERT INTO public.site_features (title, description, icon_name, sort_order) VALUES
('توصيل لجميع المحافظات', 'شحن سريع وآمن لجميع أنحاء الجمهورية', 'Truck', 1),
('تقسيط مريح', 'بدون مقدم وفائدة بسيطة', 'CreditCard', 2),
('صيانة شاملة', 'قطع غيار أصلية وفنيين محترفين', 'Wrench', 3),
('خدمة ما بعد البيع', 'دعم فني متواصل بعد الشراء', 'Headphones', 4),
('منتجات أصلية', 'جميع منتجاتنا أصلية 100% بضمان', 'ShieldCheck', 5),
('أسعار تنافسية', 'أفضل الأسعار في السوق المصري', 'BadgePercent', 6);
