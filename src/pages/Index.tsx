import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsCarousel from "@/components/ProductsCarousel";
import HeroProductSection from "@/components/HeroProductSection";
import HomepageSections from "@/components/HomepageSections";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSiteTexts } from "@/hooks/useSiteTexts";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Index = () => {
  const { data: products = [], isLoading } = useProducts();
  const { data: settings } = useSiteSettings();
  const { data: texts } = useSiteTexts();
  useVisitorTracking();

  const googleDriveUrl = (settings as any)?.google_drive_url;
  if (googleDriveUrl && googleDriveUrl.trim()) {
    window.location.href = googleDriveUrl;
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <ProductsCarousel />
      <HeroProductSection />
      {isLoading && products.length === 0 ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <HomepageSections />
      )}
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
