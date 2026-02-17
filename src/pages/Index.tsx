import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsGrid from "@/components/ProductsGrid";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Index = () => {
  const { data: products = [], isLoading } = useProducts();
  const { data: settings } = useSiteSettings();
  useVisitorTracking();

  // Filter products based on site_type setting
  const siteType = (settings as any)?.site_type || "both";
  const filteredProducts = products.filter((p) => {
    if (siteType === "both") return true;
    const catSlug = (p.categories as any)?.slug;
    if (siteType === "gasoline") return catSlug !== "electric";
    if (siteType === "electric") return catSlug === "electric";
    return true;
  });

  // Check if Google Drive redirect is set
  const googleDriveUrl = (settings as any)?.google_drive_url;
  if (googleDriveUrl && googleDriveUrl.trim()) {
    window.location.href = googleDriveUrl;
    return null;
  }

  const isElectric = siteType === "electric";

  return (
    <div className={`min-h-screen flex flex-col ${isElectric ? "electric-theme" : ""}`}>
      <Navbar />
      <HeroSection />
      {isLoading && products.length === 0 ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ProductsGrid products={filteredProducts} title="أحدث المنتجات" />
      )}
      <FeaturesSection />
      <Footer />

      {isElectric && (
        <style>{`
          .electric-theme {
            --primary: 200 85% 55%;
            --primary-foreground: 0 0% 100%;
            --ring: 200 85% 55%;
            --accent: 180 100% 45%;
          }
          .electric-theme .text-gradient {
            background: linear-gradient(135deg, hsl(200, 85%, 55%) 0%, hsl(180, 100%, 55%) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .electric-theme .gradient-primary {
            background: linear-gradient(135deg, hsl(200, 85%, 55%) 0%, hsl(180, 90%, 45%) 100%);
          }
        `}</style>
      )}
    </div>
  );
};

export default Index;
