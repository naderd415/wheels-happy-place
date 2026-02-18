import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  // Compute min/max prices
  const { minPrice, maxPrice } = useMemo(() => {
    if (!products.length) return { minPrice: 0, maxPrice: 200000 };
    const prices = products.map((p) => p.price);
    return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
  }, [products]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const slug = (p.categories as any)?.slug;
      if (slug) counts[slug] = (counts[slug] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered & sorted products
  const filtered = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => (p.categories as any)?.slug === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Price filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "ar"));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  const handleFilterChange = () => setCurrentPage(1);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setPriceRange([minPrice, maxPrice]);
    setSortBy("default");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory || searchQuery || sortBy !== "default" || priceRange[0] > minPrice || priceRange[1] < maxPrice;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 pt-8 pb-4">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">المعرض</span>
          {selectedCategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-foreground">
                {categories.find((c) => c.slug === selectedCategory)?.name}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-black">المعرض</h1>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 ml-2" />
            الفلاتر
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 flex-1">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Top bar: search + sort + results count */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن المنتجات..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
                  className="pr-10 bg-card border-border"
                />
              </div>
              <Select value={sortBy} onValueChange={(v) => { setSortBy(v); handleFilterChange(); }}>
                <SelectTrigger className="w-full sm:w-[200px] bg-card border-border">
                  <SelectValue placeholder="الترتيب الافتراضي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">الترتيب الافتراضي</SelectItem>
                  <SelectItem value="price-asc">السعر: من الأقل</SelectItem>
                  <SelectItem value="price-desc">السعر: من الأعلى</SelectItem>
                  <SelectItem value="name-asc">الاسم: أ - ي</SelectItem>
                  <SelectItem value="newest">الأحدث</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground mb-4">
              عرض {paginatedProducts.length > 0 ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}` : "0"} من أصل {filtered.length} نتيجة
            </div>

            {/* Active filter tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory && (
                  <Badge label={categories.find(c => c.slug === selectedCategory)?.name || ""} onRemove={() => { setSelectedCategory(null); handleFilterChange(); }} />
                )}
                {searchQuery && (
                  <Badge label={`بحث: ${searchQuery}`} onRemove={() => { setSearchQuery(""); handleFilterChange(); }} />
                )}
                <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                  مسح الكل
                </button>
              </div>
            )}

            {/* Products grid */}
            {isLoading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                لا توجد منتجات مطابقة للبحث
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((product, i) => (
                  <AnimateOnScroll key={product.id} delay={i * 80}>
                    <ProductCard product={product} />
                  </AnimateOnScroll>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className={currentPage === page ? "gradient-primary text-primary-foreground" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar filters */}
          <aside className={`w-72 shrink-0 space-y-6 ${showFilters ? "block" : "hidden"} lg:block`}>
            {/* Search in sidebar */}
            <div className="gradient-card rounded-xl border border-border/50 p-5">
              <h3 className="font-bold text-lg mb-3">البحث</h3>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن المنتجات..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
                  className="pr-10 bg-secondary/50 border-border/50"
                />
              </div>
            </div>

            {/* Price filter */}
            <div className="gradient-card rounded-xl border border-border/50 p-5">
              <h3 className="font-bold text-lg mb-4">تصفية حسب السعر</h3>
              <Slider
                min={minPrice}
                max={maxPrice}
                step={1000}
                value={priceRange}
                onValueChange={(v) => { setPriceRange(v as [number, number]); handleFilterChange(); }}
                className="mb-4"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {priceRange[0].toLocaleString("ar-EG")} ج.م
                </span>
                <span className="text-muted-foreground">—</span>
                <span className="text-muted-foreground">
                  {priceRange[1].toLocaleString("ar-EG")} ج.م
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={handleFilterChange}
              >
                تصفية
              </Button>
            </div>

            {/* Category filter */}
            <div className="gradient-card rounded-xl border border-border/50 p-5">
              <h3 className="font-bold text-lg mb-3">تصفية حسب القسم</h3>
              <div className="space-y-2">
                <button
                  onClick={() => { setSelectedCategory(null); handleFilterChange(); }}
                  className={`w-full text-right py-1.5 px-2 rounded-md text-sm transition-colors ${
                    !selectedCategory ? "text-primary font-bold bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  الكل ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); handleFilterChange(); }}
                    className={`w-full text-right py-1.5 px-2 rounded-md text-sm transition-colors ${
                      selectedCategory === cat.slug ? "text-primary font-bold bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {cat.name} ({categoryCounts[cat.slug] || 0})
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Small filter tag component
const Badge = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
    {label}
    <button onClick={onRemove} className="hover:text-primary-foreground">
      <X className="h-3 w-3" />
    </button>
  </span>
);

export default Shop;
