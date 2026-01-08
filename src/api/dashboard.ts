const API_BASE = "cravecallcateringbk-hrgjcyd3aeaxc3dz.canadacentral-01.azurewebsites.net";

export type DashboardSummary = {
  day: string;
  total_orders_today: number;
  total_revenue_today: number;
  upcoming_events: number;
  pending_orders: number;
  recent_orders: any[];
};

export async function fetchDashboardSummary(day?: string) {
  const url = day
    ? `${API_BASE}/dashboard/summary?day=${encodeURIComponent(day)}`
    : `${API_BASE}/dashboard/summary`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  return (await res.json()) as DashboardSummary;
}

