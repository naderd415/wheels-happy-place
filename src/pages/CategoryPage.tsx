import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductsGrid from "@/components/ProductsGrid";
import Footer from "@/components/Footer";
import { useProducts, useCategories } from "@/hooks/useProducts";
import PistonAnimation from "@/components/PistonAnimation";
import ElectricAnimation from "@/components/ElectricAnimation";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const category = categories.find((c) => c.slug === slug);
  const filtered = products.filter((p) => (p.categories as any)?.slug === slug);

  const isElectric = slug === "electric";
  const isGasoline = slug === "motorcycles";

  return (
    <div className={`min-h-screen flex flex-col ${isElectric ? "electric-theme" : ""}`}>
      <Navbar />

      {/* Category Hero with Neon Animation */}
      <div className={`relative overflow-hidden py-20 border-b border-border/50 ${isElectric ? "bg-gradient-to-b from-[hsl(200,80%,6%)] to-background" : ""}`}>
        {isGasoline && <PistonAnimation />}
        {isElectric && <ElectricAnimation />}
        <div className="container mx-auto px-4 relative z-10">
          <h1 className={`text-4xl md:text-5xl font-black ${isElectric ? "text-[hsl(200,100%,65%)]" : ""}`}>
            {category?.name || slug}
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            {isGasoline && "أقوى الموتوسيكلات بمحركات بنزين عالية الأداء"}
            {isElectric && "موتوسيكلات كهربائية صديقة للبيئة وموفرة"}
            {slug === "scooters" && "سكوترات عملية للتنقل اليومي"}
            {slug === "tricycles" && "تروسيكلات للنقل والتوصيل"}
          </p>
        </div>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ProductsGrid products={filtered} />
      )}
      <Footer />

      {isElectric && (
        <style>{`
          .electric-theme {
            --primary: 200 85% 55%;
            --primary-foreground: 0 0% 100%;
            --ring: 200 85% 55%;
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

export default CategoryPage;
