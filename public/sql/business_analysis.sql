-- Sayaka Alam portfolio: SQL-first business analysis demonstration
-- Dataset: analytics/sample-data/orders.csv (synthetic)
-- Purpose: show how a business question becomes a query, insight, and decision.

-- 1) Revenue and average order value by segment
SELECT
  segment,
  COUNT(*) AS orders,
  SUM(revenue) AS revenue,
  ROUND(AVG(revenue), 2) AS average_order_value
FROM portfolio_orders
GROUP BY segment
ORDER BY revenue DESC;

-- 2) High-value customer groups with more than one order
WITH customer_value AS (
  SELECT
    customer_id,
    segment,
    COUNT(*) AS order_count,
    SUM(revenue) AS lifetime_revenue,
    AVG(revenue) AS avg_order_value
  FROM portfolio_orders
  GROUP BY customer_id, segment
)
SELECT
  customer_id,
  segment,
  order_count,
  ROUND(lifetime_revenue, 2) AS lifetime_revenue,
  ROUND(avg_order_value, 2) AS avg_order_value
FROM customer_value
WHERE order_count > 1
ORDER BY lifetime_revenue DESC;

-- 3) Revenue by region and category: useful for allocation / campaign decisions
SELECT
  region,
  category,
  COUNT(*) AS orders,
  ROUND(SUM(revenue), 2) AS revenue,
  ROUND(100.0 * SUM(revenue) / SUM(SUM(revenue)) OVER (PARTITION BY region), 1) AS region_revenue_share_pct
FROM portfolio_orders
GROUP BY region, category
ORDER BY region, revenue DESC;

-- 4) Month-over-month revenue trend
WITH monthly AS (
  SELECT
    DATE_TRUNC('month', order_date) AS month,
    SUM(revenue) AS revenue
  FROM portfolio_orders
  GROUP BY DATE_TRUNC('month', order_date)
), compared AS (
  SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS previous_month_revenue
  FROM monthly
)
SELECT
  month,
  ROUND(revenue, 2) AS revenue,
  ROUND(previous_month_revenue, 2) AS previous_month_revenue,
  ROUND(100.0 * (revenue - previous_month_revenue) / NULLIF(previous_month_revenue, 0), 1) AS mom_growth_pct
FROM compared
ORDER BY month;

-- 5) Simple retention-priority logic
-- This is a decision-support example, not a claim about a real company.
WITH customer_summary AS (
  SELECT
    customer_id,
    segment,
    COUNT(*) AS order_count,
    SUM(revenue) AS total_revenue,
    MAX(order_date) AS last_order_date
  FROM portfolio_orders
  GROUP BY customer_id, segment
), scored AS (
  SELECT
    *,
    CASE
      WHEN total_revenue >= 1500 AND order_count >= 2 THEN 'High priority'
      WHEN total_revenue >= 800 THEN 'Medium priority'
      ELSE 'Monitor'
    END AS retention_priority
  FROM customer_summary
)
SELECT *
FROM scored
ORDER BY total_revenue DESC;
