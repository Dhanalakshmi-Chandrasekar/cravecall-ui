// src/api/customers.ts
const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchCustomersSummary() {
  const res = await fetch(`${API_BASE}/customers/summary`);
  if (!res.ok) throw new Error("Failed to fetch customers summary");
  return await res.json();
}


