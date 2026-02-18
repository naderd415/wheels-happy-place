import { useQuery } from "@tanstack/react-query";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export type SiteTexts = Record<string, string>;

export const useSiteTexts = () => {
  return useQuery({
    queryKey: ["site-texts"],
    queryFn: async (): Promise<SiteTexts> => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/site_texts?select=text_key,text_value`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch site texts");
      const rows: { text_key: string; text_value: string }[] = await res.json();
      const map: SiteTexts = {};
      rows.forEach((r) => (map[r.text_key] = r.text_value));
      return map;
    },
    staleTime: 30000,
  });
};
