"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart, Database, RefreshCw, Sparkles, TableIcon } from "@/components/icons";

type AnalyticsResponse = {
  dataset: { name: string; synthetic: boolean; rows: number; filteredRows: number; note: string };
  filters: {
    segment: string;
    region: string;
    options: { segments: string[]; regions: string[] };
  };
  kpis: {
    revenue: number;
    orders: number;
    customers: number;
    averageOrderValue: number;
    repeatCustomerRate: number;
  };
  monthly: { month: string; label: string; revenue: number; orders: number }[];
  breakdowns: {
    segment: BreakdownRow[];
    region: BreakdownRow[];
    category: BreakdownRow[];
    channel: BreakdownRow[];
  };
  insights: string[];
};

type BreakdownRow = { label: string; revenue: number; orders: number; share: number };

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function AnalyticsLab() {
  const [segment, setSegment] = useState("All");
  const [region, setRegion] = useState("All");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    const params = new URLSearchParams({ segment, region });
    fetch(`/api/analytics?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Analytics endpoint unavailable");
        return (await response.json()) as AnalyticsResponse;
      })
      .then((payload) => {
        setData(payload);
        setState("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState("error");
      });

    return () => controller.abort();
  }, [segment, region]);

  const maxMonthly = useMemo(() => Math.max(1, ...(data?.monthly.map((item) => item.revenue) ?? [1])), [data]);
  const maxCategory = useMemo(() => Math.max(1, ...(data?.breakdowns.category.map((item) => item.revenue) ?? [1])), [data]);

  return (
    <div className="analytics-lab" aria-labelledby="analytics-lab-title">
      <div className="analytics-lab-head">
        <div>
          <span className="analytics-kicker"><BarChart /> Interactive analyst lab</span>
          <h3 id="analytics-lab-title">Ask → filter → compare → explain.</h3>
          <p>
            This full-stack demo sends filter choices to a server-side analytics endpoint, calculates KPIs and breakdowns, and returns plain-language observations. The dataset is synthetic and exists only to demonstrate analytical reasoning.
          </p>
        </div>
        <div className={`analytics-state analytics-${state}`}><i /> {state === "loading" ? "Recalculating" : state === "ready" ? "Backend connected" : "Backend unavailable"}</div>
      </div>

      <div className="analytics-filters">
        <label>
          Customer segment
          <select value={segment} onChange={(event) => setSegment(event.target.value)}>
            {(data?.filters.options.segments ?? ["All", "Enterprise", "SMB", "Consumer"]).map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Region
          <select value={region} onChange={(event) => setRegion(event.target.value)}>
            {(data?.filters.options.regions ?? ["All", "North", "South", "East", "West"]).map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <button className="analytics-reset" type="button" onClick={() => { setSegment("All"); setRegion("All"); }}>
          <RefreshCw /> Reset filters
        </button>
      </div>

      {state === "error" ? (
        <div className="analytics-error">The demo endpoint could not load. The rest of the portfolio remains fully usable.</div>
      ) : (
        <>
          <div className="kpi-grid" aria-label="Analytics KPIs">
            <article><span>Revenue</span><strong>{data ? currency.format(data.kpis.revenue) : "—"}</strong><small>Selected slice</small></article>
            <article><span>Orders</span><strong>{data?.kpis.orders ?? "—"}</strong><small>Transaction count</small></article>
            <article><span>Average order</span><strong>{data ? currency.format(data.kpis.averageOrderValue) : "—"}</strong><small>Revenue / orders</small></article>
            <article><span>Repeat customers</span><strong>{data ? `${data.kpis.repeatCustomerRate}%` : "—"}</strong><small>More than one order</small></article>
          </div>

          <div className="analytics-grid">
            <article className="analytics-panel trend-panel">
              <div className="analytics-panel-title"><span><BarChart /> Revenue trend</span><small>Jan–Jun 2026 demo data</small></div>
              <div className="trend-chart" role="img" aria-label="Monthly revenue bar chart">
                {(data?.monthly ?? []).map((item) => (
                  <div className="trend-column" key={item.month}>
                    <span className="trend-value">{currency.format(item.revenue)}</span>
                    <div className="trend-track"><div className="trend-bar" style={{ height: `${Math.max(8, (item.revenue / maxMonthly) * 100)}%` }} /></div>
                    <span className="trend-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="analytics-panel insight-panel">
              <div className="analytics-panel-title"><span><Sparkles /> Insight notes</span><small>Generated from returned metrics</small></div>
              <ol className="insight-list">
                {(data?.insights ?? ["Loading evidence…"]).map((insight, index) => (
                  <li key={`${index}-${insight}`}><span>{String(index + 1).padStart(2, "0")}</span><p>{insight}</p></li>
                ))}
              </ol>
            </article>
          </div>

          <article className="analytics-panel category-panel">
            <div className="analytics-panel-title"><span><TableIcon /> Category contribution</span><small>Revenue, order count, and share</small></div>
            <div className="category-table" role="table" aria-label="Category performance">
              <div className="category-row category-header" role="row"><span>Category</span><span>Revenue</span><span>Orders</span><span>Share</span><span>Relative revenue</span></div>
              {(data?.breakdowns.category ?? []).map((row) => (
                <div className="category-row" role="row" key={row.label}>
                  <strong>{row.label}</strong>
                  <span>{currency.format(row.revenue)}</span>
                  <span>{row.orders}</span>
                  <span>{row.share}%</span>
                  <div className="category-meter" aria-hidden="true"><i style={{ width: `${Math.max(4, (row.revenue / maxCategory) * 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </article>

          <div className="analytics-footnote">
            <Database />
            <p><strong>Transparent demo:</strong> {data?.dataset.note ?? "Synthetic portfolio data."} The CRMS repository remains the separate public evidence for SQL/database coursework.</p>
          </div>
        </>
      )}
    </div>
  );
}
