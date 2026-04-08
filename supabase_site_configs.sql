-- Create site_configs table
CREATE TABLE IF NOT EXISTS site_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text DEFAULT 'Aryam Maps',
  support_email text DEFAULT 'support@aryammaps.com',
  admin_email text DEFAULT 'admin@aryammaps.com', -- New Account Email for login
  currency text DEFAULT 'INR',
  admin_password text DEFAULT 'sgpproject',
  two_factor_enabled boolean DEFAULT false,
  admin_2fa_secret text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert initial record if not exists
INSERT INTO site_configs (id, store_name, support_email, admin_email, currency, admin_password)
SELECT gen_random_uuid(), 'Aryam Maps', 'support@aryammaps.com', 'admin@aryammaps.com', 'INR', 'sgpproject'
WHERE NOT EXISTS (SELECT 1 FROM site_configs);
