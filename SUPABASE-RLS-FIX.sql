-- Run this in Supabase SQL Editor to fix Row Level Security policies.
-- If the 'products' table already exists, this only adds/fixes the policies.

-- 1. Make sure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Drop old policies if they exist (safe to re-run)
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Admin insert access" ON products;
DROP POLICY IF EXISTS "Admin update access" ON products;
DROP POLICY IF EXISTS "Admin delete access" ON products;

-- 3. Public can read all products (needed for the storefront)
CREATE POLICY "Public read access"
  ON products FOR SELECT
  USING (true);

-- 4. Authenticated admin users can insert products
CREATE POLICY "Admin insert access"
  ON products FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 5. Authenticated admin users can update products
CREATE POLICY "Admin update access"
  ON products FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- 6. Authenticated admin users can delete products
CREATE POLICY "Admin delete access"
  ON products FOR DELETE
  USING (auth.uid() IS NOT NULL);
