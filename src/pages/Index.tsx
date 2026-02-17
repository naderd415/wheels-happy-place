import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsGrid from "@/components/ProductsGrid";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";

const Index = () => {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">جاري التحميل...</div>
      ) : (
        <ProductsGrid products={products || []} title="وصل الينا حديثاً" />
      )}
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
