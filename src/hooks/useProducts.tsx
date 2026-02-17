import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function fetchFromSupabase(table: string, select: string, orderBy?: string) {
  let url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}`;
  if (orderBy) url += `&order=${orderBy}`;
  
  console.log(`[fetchFromSupabase] Fetching ${table}...`);
  
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error(`[fetchFromSupabase] ${table} error:`, res.status, text);
    throw new Error(`Failed to fetch ${table}: ${res.status}`);
  }
  
  const data = await res.json();
  console.log(`[fetchFromSupabase] ${table} success:`, data.length, 'rows');
  return data;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchFromSupabase("products", "*,categories(name,slug)", "sort_order.asc"),
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const url = `${SUPABASE_URL}/rest/v1/products?select=${encodeURIComponent("*,categories(name,slug)")}&id=eq.${id}`;
      const res = await fetch(url, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Accept': 'application/vnd.pgrst.object+json',
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
      return res.json();
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchFromSupabase("categories", "*", "sort_order.asc"),
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
  });
};
