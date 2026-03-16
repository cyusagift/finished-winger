-- Create categories table for bag types
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table for inventory
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sku TEXT UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 5,
  cost_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  selling_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  color TEXT,
  size TEXT,
  supplier TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for now - single shop use)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (single shop system)
CREATE POLICY "Allow all access to categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES
  ('School Bags', 'Backpacks and bags for students'),
  ('Laptop Bags', 'Bags designed for laptops and electronics'),
  ('Travel Bags', 'Luggage and travel accessories'),
  ('Handbags', 'Fashion handbags and purses'),
  ('Sports Bags', 'Gym bags and sports equipment carriers');