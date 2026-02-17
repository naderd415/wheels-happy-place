import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsGrid from "@/components/ProductsGrid";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Index = () => {
  const { data: products, isLoading } = useProducts();
  const { data: settings } = useSiteSettings();
  useVisitorTracking();

  // Filter products based on site_type setting
  const filteredProducts = products?.filter((p) => {
    const siteType = (settings as any)?.site_type || "both";
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">جاري التحميل...</div>
      ) : (
        <ProductsGrid products={filteredProducts || []} title="أحدث المنتجات" />
      )}
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
