import { useQuery } from "@tanstack/react-query";
import { useProducts } from "@/hooks/useProducts";
import ProductsGrid from "./ProductsGrid";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const HomepageSections = () => {
  const { data: sections = [] } = useQuery({
    queryKey: ["homepage-sections"],
    queryFn: async () => {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/homepage_sections?select=*&is_active=eq.true&order=sort_order.asc`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 30000,
  });

  const { data: products = [] } = useProducts();

  if (!sections.length || !products.length) return null;

  return (
    <>
      {sections.map((section: any) => {
        let filtered: any[] = [];

        if (section.filter_type === "latest") {
          filtered = [...products].filter((p: any) => p.is_available).slice(0, 8);
        } else if (section.filter_type === "discounted") {
          filtered = products.filter((p: any) => p.original_price && p.original_price > p.price && p.is_available).slice(0, 8);
        } else if (section.filter_type === "newest") {
          filtered = [...products].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).filter((p: any) => p.is_available).slice(0, 8);
        } else {
          filtered = products.filter((p: any) => p.is_available).slice(0, 8);
        }

        if (!filtered.length) return null;

        return <ProductsGrid key={section.id} products={filtered} title={section.title} />;
      })}
    </>
  );
};

export default HomepageSections;
