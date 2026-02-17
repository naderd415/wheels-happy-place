import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();
      if (error) {
        console.error("Site settings fetch error:", error);
        throw error;
      }
      return data;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000,
  });
};
