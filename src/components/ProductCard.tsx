import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products"> & {
  categories: { name: string; slug: string } | null;
};

const ProductCard = ({ product }: { product: Product }) => {
  const hasDiscount = product.original_price && product.original_price > product.price;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group gradient-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground text-sm">لا توجد صورة</span>
          </div>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <Badge variant="destructive" className="text-base px-4 py-1">غير متوفر</Badge>
          </div>
        )}
        {hasDiscount && product.is_available && (
          <Badge className="absolute top-3 left-3 gradient-primary text-primary-foreground">تخفيض</Badge>
        )}
      </div>
      <div className="p-4 space-y-2">
        {product.categories && (
          <span className="text-xs text-muted-foreground">{product.categories.name}</span>
        )}
        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-primary">
            {product.price.toLocaleString("ar-EG")} ج.م
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {product.original_price!.toLocaleString("ar-EG")} ج.م
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
