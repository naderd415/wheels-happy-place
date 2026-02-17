import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProducts = (categorySlug?: string) => {
  return useQuery({
    queryKey: ["products", categorySlug],
    queryFn: async () => {
      const query = supabase
        .from("products")
        .select("*, categories(name, slug)")
        .order("sort_order", { ascending: true });

      const { data, error } = await query;
      if (error) {
        console.error("Products fetch error:", error);
        throw error;
      }
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) {
        console.error("Categories fetch error:", error);
        throw error;
      }
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000,
  });
};
