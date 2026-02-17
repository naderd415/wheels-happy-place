import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useVisitorTracking = () => {
  useEffect(() => {
    const tracked = sessionStorage.getItem("visit_tracked");
    if (!tracked) {
      (supabase.rpc as any)("track_visit").then(() => {
        sessionStorage.setItem("visit_tracked", "1");
      }).catch(() => {});
    }
  }, []);
};
