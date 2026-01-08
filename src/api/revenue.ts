// src/api/revenue.ts
const API_BASE = "cravecallcateringbk-hrgjcyd3aeaxc3dz.canadacentral-01.azurewebsites.net";

export async function fetchRevenueSummary(days = 8) {
  const res = await fetch(`${API_BASE}/revenue/summary?days=${days}`);
  if (!res.ok) throw new Error("Failed to fetch revenue summary");
  return await res.json();
}

