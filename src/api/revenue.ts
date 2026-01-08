// src/api/revenue.ts
const API_BASE = "http://127.0.0.1:9002";

export async function fetchRevenueSummary(days = 8) {
  const res = await fetch(`${API_BASE}/revenue/summary?days=${days}`);
  if (!res.ok) throw new Error("Failed to fetch revenue summary");
  return await res.json();
}
