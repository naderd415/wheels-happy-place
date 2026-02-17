import { useQuery } from "@tanstack/react-query";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      console.log("[useSiteSettings] Starting fetch...");
      const url = `${SUPABASE_URL}/rest/v1/site_settings?select=*&limit=1`;
      const res = await fetch(url, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Accept': 'application/vnd.pgrst.object+json',
        },
      });
      
      if (!res.ok) {
        const text = await res.text();
        console.error("[useSiteSettings] Error:", res.status, text);
        throw new Error(`Failed to fetch settings: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("[useSiteSettings] Success:", data);
      return data;
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
  });
};
