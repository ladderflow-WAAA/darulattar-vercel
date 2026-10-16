-- ==========================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO ENABLE CLOUD ORDER SYNC
-- ==========================================================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  customer_address TEXT NOT NULL,
  city TEXT DEFAULT 'Chennai',
  state TEXT DEFAULT 'Tamil Nadu',
  pincode TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_speed TEXT DEFAULT 'Delhivery Standard',
  estimated_delivery_date TEXT DEFAULT '',
  payment_method TEXT DEFAULT 'DIRECT_MERCHANT_UPI',
  utr_number TEXT DEFAULT '',
  payment_vpa TEXT DEFAULT '',
  payment_status TEXT NOT NULL DEFAULT 'VERIFICATION_PENDING',
  delhivery_tracking_awb TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 1. Allow any customer to insert an order (Checkout / WhatsApp)
DROP POLICY IF EXISTS "Public insert orders" ON orders;
CREATE POLICY "Public insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- 2. Allow reading orders (for Admin Dashboard across all devices)
DROP POLICY IF EXISTS "Public read orders" ON orders;
CREATE POLICY "Public read orders"
  ON orders FOR SELECT
  USING (true);

-- 3. Allow updating order status and AWB tracking
DROP POLICY IF EXISTS "Allow update orders" ON orders;
CREATE POLICY "Allow update orders"
  ON orders FOR UPDATE
  USING (true);

-- 4. Allow deleting orders
DROP POLICY IF EXISTS "Allow delete orders" ON orders;
CREATE POLICY "Allow delete orders"
  ON orders FOR DELETE
  USING (true);
