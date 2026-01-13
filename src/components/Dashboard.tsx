// import { ShoppingBag, DollarSign, Calendar, Clock } from 'lucide-react';
// import { mockDashboardStats, mockOrders } from '../data/mockData';

// export default function Dashboard() {
//   const stats = mockDashboardStats;
//   const recentOrders = mockOrders.slice(0, 5);

//   const cards = [
//     {
//       title: 'Total Orders Today',
//       value: stats.totalOrdersToday,
//       icon: ShoppingBag,
//       color: 'from-blue-500 to-blue-600',
//       bgColor: 'bg-blue-50',
//       textColor: 'text-blue-600',
//     },
//     {
//       title: 'Total Revenue',
//       value: `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
//       icon: DollarSign,
//       color: 'from-green-500 to-green-600',
//       bgColor: 'bg-green-50',
//       textColor: 'text-green-600',
//     },
//     {
//       title: 'Upcoming Events',
//       value: stats.upcomingEvents,
//       icon: Calendar,
//       color: 'from-orange-500 to-orange-600',
//       bgColor: 'bg-orange-50',
//       textColor: 'text-orange-600',
//     },
//     {
//       title: 'Pending Orders',
//       value: stats.pendingOrders,
//       icon: Clock,
//       color: 'from-amber-500 to-amber-600',
//       bgColor: 'bg-amber-50',
//       textColor: 'text-amber-600',
//     },
//   ];

//   const getStatusColor = (status: string) => {
//     const colors = {
//       Confirmed: 'bg-blue-100 text-blue-700',
//       Preparing: 'bg-orange-100 text-orange-700',
//       Ready: 'bg-green-100 text-green-700',
//       Delivered: 'bg-gray-100 text-gray-700',
//       Cancelled: 'bg-red-100 text-red-700',
//       Pending: 'bg-amber-100 text-amber-700',
//     };
//     return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
//   };

//   return (
//     <div className="p-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
//         <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {cards.map((card, index) => {
//           const Icon = card.icon;
//           return (
//             <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
//               <div className="flex items-start justify-between mb-4">
//                 <div className={`${card.bgColor} p-3 rounded-lg`}>
//                   <Icon className={`w-6 h-6 ${card.textColor}`} />
//                 </div>
//               </div>
//               <div className="mb-1">
//                 <div className="text-3xl font-bold text-gray-900">{card.value}</div>
//               </div>
//               <div className="text-sm text-gray-600">{card.title}</div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Order ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Event Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Guests
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Total
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {recentOrders.map((order) => (
//                 <tr key={order.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="font-medium text-gray-900">{order.id}</span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="font-medium text-gray-900">{order.customerName}</div>
//                       <div className="text-sm text-gray-500">{order.phoneNumber}</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       {new Date(order.eventDate).toLocaleDateString('en-US', {
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric'
//                       })}
//                     </div>
//                     <div className="text-sm text-gray-500">{order.eventTime}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {order.guestCount}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="font-semibold text-gray-900">
//                       ${order.grandTotal.toFixed(2)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


import { ShoppingBag, DollarSign, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "../api/dashboard";

type RawOrder = {
  order_id?: string;
  customer_name?: string;
  phone?: string;
  guest_count?: number;
  grand_total_usd?: number;
  status?: string;
  created_at?: string | number; // ✅ allow string/number
  event_date?: string;
  event_time?: string;
};

const getStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    preparing: "bg-orange-100 text-orange-700",
    ready: "bg-green-100 text-green-700",
    delivered: "bg-gray-100 text-gray-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return colors[String(status ?? "").toLowerCase()] || "bg-gray-100 text-gray-700";
};

// ✅ created_at formatter (same logic style as Orders page)
function normalizeDateInput(value: any): string {
  if (!value) return new Date().toISOString();

  if (value instanceof Date) return value.toISOString();

  if (typeof value === "number") {
    const ms = value < 1_000_000_000_000 ? value * 1000 : value;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }

  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }

  return new Date().toISOString();
}

function formatCreatedAt(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{
    total_orders_today: number;
    total_revenue_today: number;
    upcoming_events: number;
    pending_orders: number;
    recent_orders: RawOrder[];
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardSummary(); // ✅ calls /dashboard/summary
        setSummary({
          total_orders_today: data.total_orders_today,
          total_revenue_today: data.total_revenue_today,
          upcoming_events: data.upcoming_events,
          pending_orders: data.pending_orders,
          recent_orders: Array.isArray(data.recent_orders) ? data.recent_orders : [],
        });
      } catch (e) {
        console.error(e);
        setSummary({
          total_orders_today: 0,
          total_revenue_today: 0,
          upcoming_events: 0,
          pending_orders: 0,
          recent_orders: [],
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard…</div>;
  if (!summary) return <div className="p-8">Failed to load dashboard</div>;

  const cards = [
    {
      title: "Total Orders Today",
      value: summary.total_orders_today,
      icon: ShoppingBag,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Revenue Today",
      value: `$${Number(summary.total_revenue_today ?? 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Upcoming Events",
      value: summary.upcoming_events,
      icon: Calendar,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Pending Orders",
      value: summary.pending_orders,
      icon: Clock,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Today’s performance and latest orders.</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border p-6 shadow-sm">
              <div className={`${card.bgColor} p-3 rounded-xl w-fit mb-4`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              <div className="text-3xl font-semibold text-gray-900">{card.value}</div>
              <div className="text-sm text-gray-600 mt-1">{card.title}</div>
            </div>
          );
        })}
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Orders</h2>
          <span className="text-sm text-gray-500">
            {summary.recent_orders.length} order{summary.recent_orders.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            {/* ✅ ORANGE COLUMN HEADING */}
            <thead className="bg-orange-600">
              <tr className="text-xs uppercase tracking-wide text-white">
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Created Time</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Event</th>
                <th className="px-6 py-4 text-left">Guests</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {summary.recent_orders.map((order, idx) => {
                const oid = order.order_id ?? `TEMP-${idx}`;
                const createdIso = normalizeDateInput(order.created_at);

                return (
                  <tr key={oid} className="border-t hover:bg-orange-50/40 transition">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-mono text-gray-700">
                        {oid}
                      </span>
                    </td>

                    {/* ✅ NEW: Created Time */}
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {formatCreatedAt(createdIso)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.customer_name ?? "Unknown"}</div>
                      <div className="text-sm text-gray-500">{order.phone ?? "-"}</div>
                    </td>

                    <td className="px-6 py-4">
                      {order.event_date ?? "-"} <br />
                      <span className="text-sm text-gray-500">{order.event_time ?? ""}</span>
                    </td>

                    <td className="px-6 py-4 text-gray-700">{order.guest_count ?? 0}</td>

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ${Number(order.grand_total_usd ?? 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {String(order.status ?? "confirmed")}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {summary.recent_orders.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-gray-500" colSpan={7}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
