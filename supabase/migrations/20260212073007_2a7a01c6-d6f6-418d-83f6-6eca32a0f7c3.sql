
-- Stock movement log table
CREATE TABLE public.stock_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity_removed INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  employee_name TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stock_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can view logs
CREATE POLICY "Anyone can view stock logs"
ON public.stock_logs FOR SELECT
USING (true);

-- Only authenticated users can insert logs
CREATE POLICY "Authenticated users can insert stock logs"
ON public.stock_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- No update or delete policies = nobody can modify or delete logs
