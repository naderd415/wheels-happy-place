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
      className="group block gradient-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.15)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground text-sm">لا توجد صورة</span>
          </div>
        )}
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {!product.is_available && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center backdrop-blur-sm">
            <Badge variant="destructive" className="text-base px-4 py-1">غير متوفر</Badge>
          </div>
        )}
        {hasDiscount && product.is_available && (
          <Badge className="absolute top-3 left-3 gradient-primary text-primary-foreground shadow-lg">
            تخفيض
          </Badge>
        )}
      </div>
      <div className="p-5 space-y-3">
        {product.categories && (
          <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">
            {product.categories.name}
          </span>
        )}
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-3 pt-1">
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
