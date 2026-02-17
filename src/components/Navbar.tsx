import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useCategories } from "@/hooks/useProducts";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const { data: categories } = useCategories();

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name} className="h-10 object-contain" />
            ) : (
              <span className="text-2xl font-bold text-gradient">{settings?.site_name || "أوليكس موتورز"}</span>
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              الرئيسية
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                {cat.name}
              </Link>
            ))}
            <Link to="/shop" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              المعرض
            </Link>
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-primary font-semibold">
                <Phone className="h-4 w-4" />
                {settings.phone}
              </a>
            )}
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in">
            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-foreground/80 hover:text-primary font-medium">
              الرئيسية
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-foreground/80 hover:text-primary font-medium"
              >
                {cat.name}
              </Link>
            ))}
            <Link to="/shop" onClick={() => setIsOpen(false)} className="block py-2 text-foreground/80 hover:text-primary font-medium">
              المعرض
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
