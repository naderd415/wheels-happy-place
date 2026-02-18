import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "./AnimateOnScroll";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSiteTexts } from "@/hooks/useSiteTexts";
import { useProduct } from "@/hooks/useProducts";

const HeroProductSection = () => {
  const { data: settings } = useSiteSettings();
  const { data: t } = useSiteTexts();
  const heroProductId = (settings as any)?.hero_product_id;
  const { data: product } = useProduct(heroProductId || "");

  if (!heroProductId || !product) return null;

  return (
    <section className="py-20 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll>
            <div className="space-y-6 text-right">
              <span className="text-sm text-primary font-bold tracking-wider uppercase">
                {t?.hero_product_badge || "المنتج المميز"}
              </span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                {product.name}
              </h2>
              {product.description && (
                <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                  {product.description}
                </p>
              )}
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-primary">
                  {product.price.toLocaleString("ar-EG")} ج.م
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.original_price.toLocaleString("ar-EG")} ج.م
                  </span>
                )}
              </div>
              <Button asChild size="lg" className="gradient-primary text-primary-foreground font-bold text-lg px-8 py-5 rounded-xl">
                <Link to={`/product/${product.id}`}>
                  {t?.hero_product_button || "اعرف أكتر"}
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full aspect-[4/3] object-cover" />
              ) : (
                <div className="w-full aspect-[4/3] bg-secondary flex items-center justify-center">
                  <span className="text-muted-foreground">لا توجد صورة</span>
                </div>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default HeroProductSection;
