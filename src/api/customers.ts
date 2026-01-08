// src/api/customers.ts
const API_BASE = "http://127.0.0.1:9002";

export async function fetchCustomersSummary() {
  const res = await fetch(`${API_BASE}/customers/summary`);
  if (!res.ok) throw new Error("Failed to fetch customers summary");
  return await res.json();
}
