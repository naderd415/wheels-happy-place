import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

const ProductsCarousel = () => {
  const { data: products = [] } = useProducts();
  const available = products.filter((p: any) => p.is_available).slice(0, 12);

  if (!available.length) return null;

  return (
    <section className="py-8 border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="px-12">
          <Carousel opts={{ align: "start", direction: "rtl", loop: true }} className="w-full">
            <CarouselContent className="-ml-3">
              {available.map((product: any) => {
                const hasDiscount = product.original_price && product.original_price > product.price;
                return (
                  <CarouselItem key={product.id} className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <Link
                      to={`/product/${product.id}`}
                      className="group block gradient-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <span className="text-muted-foreground text-xs">لا توجد صورة</span>
                          </div>
                        )}
                        {hasDiscount && (
                          <Badge className="absolute top-2 left-2 gradient-primary text-primary-foreground text-[10px] px-2 py-0.5">
                            تخفيض
                          </Badge>
                        )}
                      </div>
                      <div className="p-3 space-y-1">
                        <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <span className="text-sm font-black text-primary block">
                          {product.price.toLocaleString("ar-EG")} ج.م
                        </span>
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="bg-primary/90 text-primary-foreground border-0 hover:bg-primary -left-10" />
            <CarouselNext className="bg-primary/90 text-primary-foreground border-0 hover:bg-primary -right-10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ProductsCarousel;
