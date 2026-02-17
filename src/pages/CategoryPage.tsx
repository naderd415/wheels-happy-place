import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductsGrid from "@/components/ProductsGrid";
import Footer from "@/components/Footer";
import { useProducts, useCategories } from "@/hooks/useProducts";
import PistonAnimation from "@/components/PistonAnimation";
import ElectricAnimation from "@/components/ElectricAnimation";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();

  const category = categories?.find((c) => c.slug === slug);
  const filtered = products?.filter((p) => (p.categories as any)?.slug === slug);

  const isGasoline = slug === "motorcycles";
  const isElectric = slug === "electric";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Category Hero with Animation */}
      <div className="relative overflow-hidden py-16 border-b border-border/50">
        {isGasoline && <PistonAnimation />}
        {isElectric && <ElectricAnimation />}
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black">
            {category?.name || slug}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isGasoline && "أقوى الموتوسيكلات بمحركات بنزين عالية الأداء"}
            {isElectric && "موتوسيكلات كهربائية صديقة للبيئة وموفرة"}
            {slug === "scooters" && "سكوترات عملية للتنقل اليومي"}
            {slug === "tricycles" && "تروسيكلات للنقل والتوصيل"}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">جاري التحميل...</div>
      ) : (
        <ProductsGrid products={filtered || []} />
      )}
      <Footer />
    </div>
  );
};

export default CategoryPage;
