// const API_BASE = "http://127.0.0.1:9002"; // change this

// export async function fetchOrders() {
//   const res = await fetch(`${API_BASE}/orders`);
//   if (!res.ok) throw new Error("Failed to fetch orders");
//   return res.json();
// }


// src/api/orders.ts
const API_BASE = "http://127.0.0.1:9002";

/**
 * IMPORTANT:
 * Orders.tsx is doing normalizeOrders(data)
 * So this file MUST return RAW backend orders (no mapping here)
 */
export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return await res.json(); // ✅ RAW backend array
}

/**
 * Backend expects lowercase status:
 * confirmed | preparing | ready | delivered | cancelled | completed (if enabled)
 */
export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(
    `${API_BASE}/orders/${encodeURIComponent(orderId)}/status?status=${encodeURIComponent(
      status.toLowerCase()
    )}`,
    { method: "PUT" }
  );

  if (!res.ok) throw new Error("Failed to update status");
  return await res.json();
}
