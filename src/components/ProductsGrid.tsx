import ProductCard from "./ProductCard";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products"> & {
  categories: { name: string; slug: string } | null;
};

const ProductsGrid = ({ products, title }: { products: Product[]; title?: string }) => {
  if (!products?.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        لا توجد منتجات حالياً
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-black mb-8">{title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
