import { useParams, Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Badge } from "@/components/ui/badge";
import InstallmentCalculator from "@/components/InstallmentCalculator";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const { data: settings } = useSiteSettings();
  const installmentEnabled = (settings as any)?.installment_enabled;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">المنتج غير موجود</div>
      </div>
    );
  }

  const hasDiscount = product.original_price && product.original_price > product.price;
  const specs = product.specs as Record<string, string> | null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowRight className="h-4 w-4" />
          العودة للمعرض
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="gradient-card rounded-lg overflow-hidden border border-border/50">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover" />
            ) : (
              <div className="w-full aspect-square bg-secondary flex items-center justify-center">
                <span className="text-muted-foreground">لا توجد صورة</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {(product.categories as any)?.name && (
              <span className="text-sm text-muted-foreground">{(product.categories as any).name}</span>
            )}
            <h1 className="text-3xl md:text-4xl font-black">{product.name}</h1>

            <div className="flex items-center gap-3">
              {product.is_available ? (
                <Badge className="bg-success text-success-foreground gap-1"><Check className="h-3 w-3" /> متوفر</Badge>
              ) : (
                <Badge variant="destructive" className="gap-1"><X className="h-3 w-3" /> غير متوفر</Badge>
              )}
              {hasDiscount && (
                <Badge className="gradient-primary text-primary-foreground">تخفيض</Badge>
              )}
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-primary">
                {product.price.toLocaleString("ar-EG")} ج.م
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.original_price!.toLocaleString("ar-EG")} ج.م
                </span>
              )}
            </div>

            {product.description && (
              <div>
                <h3 className="font-bold text-lg mb-2">الوصف</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Installment Calculator */}
            {installmentEnabled && product.price > 0 && (
              <InstallmentCalculator price={product.price} />
            )}

            {specs && Object.keys(specs).length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3">المواصفات</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="gradient-card rounded-md p-3 border border-border/30">
                      <span className="text-xs text-muted-foreground">{key}</span>
                      <p className="font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {product.images && product.images.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3">صور إضافية</h3>
                <div className="grid grid-cols-3 gap-3">
                  {product.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="rounded-md w-full aspect-square object-cover border border-border/30" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
