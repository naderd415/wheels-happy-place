import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSiteTexts } from "@/hooks/useSiteTexts";
import { useCategories } from "@/hooks/useProducts";
import { Phone, MapPin, Facebook } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const { data: categories } = useCategories();
  const { data: t } = useSiteTexts();

  const copyright = (t?.footer_copyright || "© {year} {site_name}. جميع الحقوق محفوظة.")
    .replace("{year}", String(new Date().getFullYear()))
    .replace("{site_name}", settings?.site_name || t?.site_name_display || "أوليكس موتورز");

  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <AnimateOnScroll>
            <div>
              <h3 className="text-2xl font-black text-gradient mb-4">
                {settings?.site_name || t?.site_name_display || "أوليكس موتورز"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t?.footer_description || "أحدث الموديلات بأسعار تنافسية مع خدمة ما بعد البيع"}
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <div>
              <h4 className="font-bold text-lg mb-4">{t?.footer_sections_title || "الأقسام"}</h4>
              <ul className="space-y-3">
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/category/${cat.slug}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <div>
              <h4 className="font-bold text-lg mb-4">{t?.footer_contact_title || "تواصل معنا"}</h4>
              <div className="space-y-3 text-muted-foreground">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                    <Phone className="h-4 w-4 text-primary" /> {settings.phone}
                  </a>
                )}
                {settings?.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" /> {settings.address}
                  </div>
                )}
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                    <Facebook className="h-4 w-4 text-primary" /> {t?.footer_facebook_label || "فيسبوك"}
                  </a>
                )}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
        <div className="mt-12 pt-6 border-t border-border/30 text-center text-sm text-muted-foreground">
          {copyright}
        </div>
        {t?.made_by && (
          <div className="mt-2 text-center text-xs text-muted-foreground/60">
            {t.made_by}
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
