import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductsGrid from "@/components/ProductsGrid";
import Footer from "@/components/Footer";
import { useProducts, useCategories } from "@/hooks/useProducts";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();

  const category = categories?.find((c) => c.slug === slug);
  const filtered = products?.filter((p) => (p.categories as any)?.slug === slug);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 pt-8">
        <h1 className="text-4xl font-black">{category?.name || slug}</h1>
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
