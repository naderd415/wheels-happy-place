import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useCategories } from "@/hooks/useProducts";
import { Phone, MapPin } from "lucide-react";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const { data: categories } = useCategories();

  return (
    <footer className="border-t border-border/50 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gradient mb-4">
              {settings?.site_name || "أوليكس موتورز"}
            </h3>
            <p className="text-muted-foreground text-sm">
              أحدث الموديلات بأسعار تنافسية مع خدمة ما بعد البيع
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">الأقسام</h4>
            <ul className="space-y-2">
              {categories?.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4" /> {settings.phone}
                </a>
              )}
              {settings?.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {settings.address}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/30 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {settings?.site_name || "أوليكس موتورز"}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
