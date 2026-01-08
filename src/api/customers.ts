// src/api/customers.ts
const API_BASE = "cravecallcateringbk-hrgjcyd3aeaxc3dz.canadacentral-01.azurewebsites.net";

export async function fetchCustomersSummary() {
  const res = await fetch(`${API_BASE}/customers/summary`);
  if (!res.ok) throw new Error("Failed to fetch customers summary");
  return await res.json();
}

