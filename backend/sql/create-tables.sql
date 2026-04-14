-- ═══════════════════════════════════════════════════════════════════════════
-- GrowPilot Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Create PRODUCTS table ──────────────────────────────────────────────────
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'Other',
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  min_stock INT DEFAULT 5,
  description TEXT,
  sku VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'good' CHECK (status IN ('good', 'low', 'critical')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ─── Create ORDERS table ───────────────────────────────────────────────────
CREATE TABLE orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  items JSONB NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered', 'cancelled')),
  payment_method VARCHAR(50) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'upi', 'cheque')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ─── Create EXPENSES table ─────────────────────────────────────────────────
CREATE TABLE expenses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Rent', 'Utilities', 'Supplies', 'Salaries', 'Marketing', 'Transport', 'Other')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  payment_method VARCHAR(30) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'cheque', 'transfer')),
  vendor VARCHAR(255),
  invoice_number VARCHAR(100),
  status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ─── Create USERS table ────────────────────────────────────────────────────
CREATE TABLE users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('owner', 'staff', 'admin')),
  business_name VARCHAR(255),
  business_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ─── Create Indexes for better performance ─────────────────────────────────
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX products_status_idx ON products(status);
CREATE INDEX products_sku_idx ON products(sku);
CREATE INDEX orders_customer_idx ON orders(customer_name);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_created_idx ON orders(created_at);
CREATE INDEX expenses_category_idx ON expenses(category);
CREATE INDEX expenses_created_idx ON expenses(created_at);
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_role_idx ON users(role);

-- ─── Insert Sample Data ─────────────────────────────────────────────────────
INSERT INTO products (name, category, price, stock, min_stock, sku) VALUES
  ('Rice 5kg', 'Groceries', 320, 15, 5, 'RICE-5KG'),
  ('Cooking Oil 1L', 'Oil', 180, 20, 5, 'OIL-1L'),
  ('Sugar 1kg', 'Groceries', 48, 2, 10, 'SUGAR-1KG'),
  ('Tea Powder 500g', 'Other', 190, 8, 3, 'TEA-500G'),
  ('Turmeric 500g', 'Spices', 150, 25, 5, 'TURMERIC-500G'),
  ('Milk 1L', 'Dairy', 55, 30, 10, 'MILK-1L');

INSERT INTO expenses (category, amount, vendor, description) VALUES
  ('Rent', 15000, 'Landlord', 'Monthly rent for store'),
  ('Utilities', 3000, 'Power Department', 'Electricity bill'),
  ('Supplies', 5000, 'Local Supplier', 'Packaging materials'),
  ('Marketing', 2000, 'Social Media', 'Online ads'),
  ('Transport', 1500, 'Transport Co', 'Delivery costs');

-- ✅ Database schema ready!
