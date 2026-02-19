import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSiteTexts } from "@/hooks/useSiteTexts";
import { useCategories } from "@/hooks/useProducts";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const { data: categories } = useCategories();
  const { data: t } = useSiteTexts();

  const [visitorTheme, setVisitorTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("visitor-theme");
    if (saved === "light" || saved === "dark") setVisitorTheme(saved);
  }, []);

  const toggleTheme = () => {
    const current = visitorTheme || ((settings as any)?.theme_mode || "dark");
    const next = current === "dark" ? "light" : "dark";
    setVisitorTheme(next);
    localStorage.setItem("visitor-theme", next);
    // Dispatch event so ThemeProvider picks it up
    window.dispatchEvent(new CustomEvent("visitor-theme-change", { detail: next }));
  };

  const isDark = (visitorTheme || (settings as any)?.theme_mode || "dark") === "dark";

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name} className="h-10 object-contain" />
            ) : (
              <span className="text-2xl font-bold text-gradient">{settings?.site_name || t?.site_name_display || "أوليكس موتورز"}</span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              {t?.nav_home || "الرئيسية"}
            </Link>
            {categories?.map((cat) => (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="text-foreground/80 hover:text-primary transition-colors font-medium">
                {cat.name}
              </Link>
            ))}
            <Link to="/shop" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              {t?.nav_shop || "المعرض"}
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              {t?.nav_contact || "اتصل بنا"}
            </Link>
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-primary font-semibold">
                <Phone className="h-4 w-4" />
                {settings.phone}
              </a>
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground/80 hover:text-primary">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in">
            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-foreground/80 hover:text-primary font-medium">
              {t?.nav_home || "الرئيسية"}
            </Link>
            {categories?.map((cat) => (
              <Link key={cat.id} to={`/category/${cat.slug}`} onClick={() => setIsOpen(false)} className="block py-2 text-foreground/80 hover:text-primary font-medium">
                {cat.name}
              </Link>
            ))}
            <Link to="/shop" onClick={() => setIsOpen(false)} className="block py-2 text-foreground/80 hover:text-primary font-medium">
              {t?.nav_shop || "المعرض"}
            </Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-foreground/80 hover:text-primary font-medium">
              {t?.nav_contact || "اتصل بنا"}
            </Link>
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="block py-2 text-primary font-semibold">
                <Phone className="h-4 w-4 inline ml-2" />{settings.phone}
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
