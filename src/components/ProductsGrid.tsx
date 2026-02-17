import AnimateOnScroll from "./AnimateOnScroll";
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        {title && (
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-3">{title}</h2>
              <div className="w-20 h-1 gradient-primary mx-auto rounded-full" />
            </div>
          </AnimateOnScroll>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <AnimateOnScroll key={product.id} delay={i * 100}>
              <ProductCard product={product} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
