import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductsGrid from "@/components/ProductsGrid";
import Footer from "@/components/Footer";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const filtered = selectedCategory
    ? products.filter((p) => (p.categories as any)?.slug === selectedCategory)
    : products;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 pt-8">
        <h1 className="text-4xl font-black mb-6">المعرض</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={!selectedCategory ? "default" : "secondary"}
            className={!selectedCategory ? "gradient-primary text-primary-foreground" : ""}
            onClick={() => setSelectedCategory(null)}
          >
            الكل
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.slug ? "default" : "secondary"}
              className={selectedCategory === cat.slug ? "gradient-primary text-primary-foreground" : ""}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name}
            </Button>
          ))}
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
    </div>
  );
};

export default Shop;
