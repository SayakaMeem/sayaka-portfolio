-- Synthetic portfolio analytics schema.
-- This is a demonstration dataset, not employer or production data.

CREATE TABLE portfolio_orders (
  order_id VARCHAR(20) PRIMARY KEY,
  order_date DATE NOT NULL,
  customer_id VARCHAR(20) NOT NULL,
  segment VARCHAR(30) NOT NULL,
  region VARCHAR(30) NOT NULL,
  category VARCHAR(40) NOT NULL,
  channel VARCHAR(30) NOT NULL,
  revenue DECIMAL(12,2) NOT NULL
);
