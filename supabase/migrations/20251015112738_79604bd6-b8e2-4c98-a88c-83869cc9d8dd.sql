-- Drop existing policies for products table
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

-- Create explicit policies for products table
-- Only admins can create new products
CREATE POLICY "Only admins can create products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update products
CREATE POLICY "Only admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete products
CREATE POLICY "Only admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can view active products (for vendors to add to inventory)
CREATE POLICY "Authenticated users can view active products"
ON public.products
FOR SELECT
TO authenticated
USING (status = 'active'::product_status);

-- Public can view active in-stock products (for customer app)
CREATE POLICY "Public can view available products"
ON public.products
FOR SELECT
TO public
USING (status = 'active'::product_status AND in_stock = true);

-- Drop and recreate vendor_products policies for clarity
DROP POLICY IF EXISTS "Admins can manage all vendor products" ON public.vendor_products;
DROP POLICY IF EXISTS "Vendors can manage own products" ON public.vendor_products;

-- Admin can manage all vendor products
CREATE POLICY "Admins can manage all vendor products"
ON public.vendor_products
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Vendors can add products to their inventory
CREATE POLICY "Vendors can add products to inventory"
ON public.vendor_products
FOR INSERT
TO authenticated
WITH CHECK (
  vendor_id IN (
    SELECT id FROM public.vendors WHERE user_id = auth.uid()
  )
);

-- Vendors can view their own products
CREATE POLICY "Vendors can view own products"
ON public.vendor_products
FOR SELECT
TO authenticated
USING (
  vendor_id IN (
    SELECT id FROM public.vendors WHERE user_id = auth.uid()
  )
);

-- Vendors can update their own products (stock, availability)
CREATE POLICY "Vendors can update own products"
ON public.vendor_products
FOR UPDATE
TO authenticated
USING (
  vendor_id IN (
    SELECT id FROM public.vendors WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  vendor_id IN (
    SELECT id FROM public.vendors WHERE user_id = auth.uid()
  )
);

-- Vendors can remove products from their inventory
CREATE POLICY "Vendors can remove own products"
ON public.vendor_products
FOR DELETE
TO authenticated
USING (
  vendor_id IN (
    SELECT id FROM public.vendors WHERE user_id = auth.uid()
  )
);