import ordersJson from "@/analytics/sample-data/orders.json";

type Order = {
  orderId: string;
  date: string;
  customerId: string;
  segment: "Enterprise" | "SMB" | "Consumer";
  region: "North" | "South" | "East" | "West";
  category: "Software" | "Services" | "Subscriptions" | "Accessories";
  channel: "Direct" | "Web" | "Partner";
  revenue: number;
};

type BreakdownRow = { label: string; revenue: number; orders: number; share: number };

const orders = ordersJson as Order[];
const round2 = (value: number) => Math.round(value * 100) / 100;
const percent = (value: number) => Math.round(value * 10) / 10;

function monthLabel(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(`${date}T00:00:00Z`));
}

function buildBreakdown(filtered: Order[], key: "segment" | "region" | "category" | "channel"): BreakdownRow[] {
  const totalRevenue = filtered.reduce((sum, order) => sum + order.revenue, 0);
  const map = new Map<string, { revenue: number; orders: number }>();

  for (const order of filtered) {
    const label = order[key];
    const current = map.get(label) ?? { revenue: 0, orders: 0 };
    current.revenue += order.revenue;
    current.orders += 1;
    map.set(label, current);
  }

  return [...map.entries()]
    .map(([label, value]) => ({
      label,
      revenue: round2(value.revenue),
      orders: value.orders,
      share: totalRevenue ? percent((value.revenue / totalRevenue) * 100) : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

function buildMonthly(filtered: Order[]) {
  const months = new Map<string, { revenue: number; orders: number }>();
  for (const order of filtered) {
    const key = order.date.slice(0, 7);
    const current = months.get(key) ?? { revenue: 0, orders: 0 };
    current.revenue += order.revenue;
    current.orders += 1;
    months.set(key, current);
  }

  return [...months.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({
      month,
      label: monthLabel(`${month}-01`),
      revenue: round2(value.revenue),
      orders: value.orders
    }));
}

function buildInsights(filtered: Order[], breakdowns: { segment: BreakdownRow[]; region: BreakdownRow[]; category: BreakdownRow[] }) {
  if (!filtered.length) {
    return ["No rows match the selected filters. Widen the filter to continue the analysis."];
  }

  const customerCounts = new Map<string, number>();
  for (const order of filtered) customerCounts.set(order.customerId, (customerCounts.get(order.customerId) ?? 0) + 1);
  const repeatCustomers = [...customerCounts.values()].filter((count) => count > 1).length;
  const repeatRate = customerCounts.size ? percent((repeatCustomers / customerCounts.size) * 100) : 0;

  const insights: string[] = [];
  const topSegment = breakdowns.segment[0];
  const topRegion = breakdowns.region[0];
  const topCategory = breakdowns.category[0];

  if (topSegment) insights.push(`${topSegment.label} contributes the largest revenue share in this view (${topSegment.share}%).`);
  if (topRegion) insights.push(`${topRegion.label} is the strongest region by revenue in the selected slice.`);
  if (topCategory) insights.push(`${topCategory.label} is the leading category by revenue, making it the first place to investigate for mix and margin effects.`);
  insights.push(`${repeatRate}% of customers in this filtered sample placed more than one order, a useful starting point for retention analysis.`);
  return insights.slice(0, 4);
}

export function getAnalytics(filters: { segment?: string | null; region?: string | null }) {
  const segment = filters.segment && filters.segment !== "All" ? filters.segment : null;
  const region = filters.region && filters.region !== "All" ? filters.region : null;

  const filtered = orders.filter((order) => (!segment || order.segment === segment) && (!region || order.region === region));
  const totalRevenue = filtered.reduce((sum, order) => sum + order.revenue, 0);
  const customers = new Set(filtered.map((order) => order.customerId));
  const customerCounts = new Map<string, number>();
  for (const order of filtered) customerCounts.set(order.customerId, (customerCounts.get(order.customerId) ?? 0) + 1);
  const repeatCustomers = [...customerCounts.values()].filter((count) => count > 1).length;

  const breakdowns = {
    segment: buildBreakdown(filtered, "segment"),
    region: buildBreakdown(filtered, "region"),
    category: buildBreakdown(filtered, "category"),
    channel: buildBreakdown(filtered, "channel")
  };

  return {
    dataset: {
      name: "Portfolio commerce demo",
      synthetic: true,
      rows: orders.length,
      filteredRows: filtered.length,
      note: "Synthetic portfolio dataset used only to demonstrate analytical workflow and backend aggregation. It is not presented as employer or production data."
    },
    filters: {
      segment: segment ?? "All",
      region: region ?? "All",
      options: {
        segments: ["All", "Enterprise", "SMB", "Consumer"],
        regions: ["All", "North", "South", "East", "West"]
      }
    },
    kpis: {
      revenue: round2(totalRevenue),
      orders: filtered.length,
      customers: customers.size,
      averageOrderValue: filtered.length ? round2(totalRevenue / filtered.length) : 0,
      repeatCustomerRate: customers.size ? percent((repeatCustomers / customers.size) * 100) : 0
    },
    monthly: buildMonthly(filtered),
    breakdowns,
    insights: buildInsights(filtered, breakdowns)
  };
}
