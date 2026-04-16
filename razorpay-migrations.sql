-- Razorpay Payment Integration - Database Migrations
-- Run these queries in Supabase SQL Editor

-- 1. Add payment tracking columns to existing orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'razorpay',
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE;

-- 2. Create a payments/transactions table for detailed tracking
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_payment_id VARCHAR(100) NOT NULL UNIQUE,
  razorpay_order_id VARCHAR(100),
  razorpay_signature VARCHAR(500),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'pending', -- pending, captured, failed, refunded
  payment_method VARCHAR(50), -- card, upi, netbanking
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB -- For storing additional Razorpay response data
);

-- 3. Create refunds table
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  razorpay_refund_id VARCHAR(100) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'created', -- created, processed, failed
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_id ON payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);

-- 5. Optional: Update orders table to add payment_status enum
-- Uncomment ONLY after updating all existing orders to use valid statuses
-- ALTER TABLE orders 
-- ADD CONSTRAINT check_payment_status 
-- CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'));

-- 6. Verify the schema was created
-- Run this to check if columns were added
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' 
-- ORDER BY ordinal_position;

-- 7. Optional: Create a view for payment analytics
CREATE OR REPLACE VIEW payment_analytics AS
SELECT 
  o.id as order_id,
  o.created_at,
  o.total_amount,
  o.status,
  p.razorpay_payment_id,
  p.status as payment_status,
  p.created_at as payment_date,
  (p.created_at - o.created_at) as time_to_payment
FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
ORDER BY o.created_at DESC;

-- 8. View all pending payments
-- SELECT * FROM payment_analytics WHERE payment_status = 'pending';

-- 9. Optional: View all successful payments with revenue
-- SELECT 
--   DATE(payment_date) as payment_date,
--   COUNT(*) as total_payments,
--   SUM(total_amount) as total_revenue
-- FROM payment_analytics
-- WHERE payment_status = 'captured'
-- GROUP BY DATE(payment_date)
-- ORDER BY payment_date DESC;
