
-- Make visitor stats insert/update more secure using a function
DROP POLICY IF EXISTS "Stats insertable by anyone" ON public.visitor_stats;
DROP POLICY IF EXISTS "Stats updatable by anyone" ON public.visitor_stats;

-- Use a database function for tracking visits instead of direct access
CREATE OR REPLACE FUNCTION public.track_visit()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.visitor_stats (date, visits, unique_visitors)
  VALUES (CURRENT_DATE, 1, 1)
  ON CONFLICT (date) DO UPDATE
  SET visits = visitor_stats.visits + 1;
END;
$$;
