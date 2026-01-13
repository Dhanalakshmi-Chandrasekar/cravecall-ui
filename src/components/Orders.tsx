import { useEffect, useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";
import { Order, OrderStatus } from "../types";
import OrderDetailsModal from "./OrderDetailsModal";
import { fetchOrders, updateOrderStatus } from "../api/orders";

/* ----------------------------------
   ✅ HELPERS
----------------------------------- */
function normalizeDateInput(value: any): string {
  if (!value) return new Date().toISOString();

  if (value instanceof Date) return value.toISOString();

  if (typeof value === "number") {
    const ms = value < 1_000_000_000_000 ? value * 1000 : value; // seconds -> ms
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

/* ----------------------------------
   🔹 NORMALIZER (BACKEND → UI)
----------------------------------- */
function normalizeOrders(apiOrders: any[]): Order[] {
  const normalizeStatus = (s?: string): OrderStatus => {
    const map: Record<string, OrderStatus> = {
      confirmed: "Confirmed",
      preparing: "Preparing",
      ready: "Ready",
      delivered: "Delivered",
      cancelled: "Cancelled",
      completed: "Delivered",
    };
    return map[String(s ?? "").toLowerCase()] ?? "Confirmed";
  };

  const normalizeItems = (items: any[]): any[] => {
    if (!Array.isArray(items)) return [];
    return items.map((it: any, idx: number) => {
      const qty = Number(it.quantity ?? it.qty ?? 1);
      const unit = Number(it.unitPrice ?? it.unit_price ?? it.price ?? 0);
      const total = Number(it.totalPrice ?? it.total_price ?? it.total ?? qty * unit);

      return {
        id: it.id ?? it.item_id ?? `${idx}`,
        name: it.name ?? it.item_name ?? "Item",
        type: it.type ?? it.category ?? "Food",
        quantity: qty,
        unitPrice: unit,
        totalPrice: total,
      };
    });
  };

  return apiOrders
    .map((o: any, index: number) => {
      const id = o.order_id ?? o.id ?? `TEMP-${index}`;

      const items = normalizeItems(o.items ?? o.ordered_items ?? []);

      const subtotal =
        Number(o.subtotal_usd ?? o.subtotal ?? o.pricing?.subtotal ?? 0) ||
        items.reduce((sum, it) => sum + Number(it.totalPrice ?? 0), 0);

      const deliveryFee = Number(o.delivery_fee_usd ?? o.delivery_fee ?? o.pricing?.delivery_fee ?? 0);
      const tax = Number(o.tax_usd ?? o.tax ?? o.pricing?.tax ?? 0);

      const grandTotal =
        Number(o.grand_total_usd ?? o.grand_total ?? o.pricing?.total ?? 0) ||
        subtotal + deliveryFee + tax;

      const createdAt = normalizeDateInput(o.created_at ?? o.createdAt ?? o.created);

      const eventDate =
        o.event_date ?? o.event?.date ?? o.eventDate ?? createdAt ?? new Date().toISOString();

      const eventTime = o.event_time ?? o.event?.time ?? o.eventTime ?? "";

      return {
        id,
        customerName: o.customer_name ?? o.customer?.name ?? "Unknown",
        phoneNumber: o.phone ?? o.customer?.phone ?? "-",
        guestCount: Number(o.guest_count ?? o.event?.guest_count ?? 0),
        deliveryType: o.delivery_type ?? o.delivery?.type ?? "-",
        address: o.address ?? o.delivery?.address?.line1 ?? "",
        status: normalizeStatus(o.status),
        currency: o.currency ?? "USD",
        createdAt,
        specialInstructions: o.special_instructions ?? o.notes ?? "",

        eventDate,
        eventTime,
        items,
        subtotal,
        deliveryFee,
        tax,
        grandTotal,
      } as Order;
    })
    .filter((o) => o.customerName !== "Unknown" || o.grandTotal > 0);
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<keyof Order>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchOrders();
        const normalized = normalizeOrders(Array.isArray(data) ? data : []);
        setOrders(normalized);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.customerName.toLowerCase().includes(q) ||
          order.phoneNumber.includes(searchTerm) ||
          order.id.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    filtered.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (sortColumn === "createdAt") {
        const aTime = new Date(String(aValue)).getTime();
        const bTime = new Date(String(bValue)).getTime();
        return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (column: keyof Order) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection(column === "createdAt" ? "desc" : "asc");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const backendStatus = newStatus.toLowerCase();
      await updateOrderStatus(orderId, backendStatus);

      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

      setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, status: newStatus } : prev));
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Confirmed: "bg-blue-100 text-blue-700",
      Preparing: "bg-orange-100 text-orange-700",
      Ready: "bg-green-100 text-green-700",
      Delivered: "bg-gray-100 text-gray-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) return <div className="p-8">Loading orders…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-600 mt-1">Track customer orders, update statuses, and review details.</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-lg bg-white border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="rounded-2xl bg-white border p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{filteredOrders.length}</p>
        </div>

        <div className="rounded-2xl bg-white border p-4 shadow-sm">
          <p className="text-xs text-gray-500">Revenue</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            ${filteredOrders.reduce((s, o) => s + (o.grandTotal || 0), 0).toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl bg-white border p-4 shadow-sm">
          <p className="text-xs text-gray-500">Confirmed</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {filteredOrders.filter((o) => o.status === "Confirmed").length}
          </p>
        </div>

        <div className="rounded-2xl bg-white border p-4 shadow-sm">
          <p className="text-xs text-gray-500">Preparing</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {filteredOrders.filter((o) => o.status === "Preparing").length}
          </p>
        </div>

        <div className="rounded-2xl bg-white border p-4 shadow-sm">
          <p className="text-xs text-gray-500">Delivered</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {filteredOrders.filter((o) => o.status === "Delivered").length}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl bg-white border p-4 lg:p-5 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Search by customer, phone…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex gap-3 flex-wrap justify-end">
            <select
              className="border rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              className="border rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={`${sortColumn}:${sortDirection}`}
              onChange={(e) => {
                const [col, dir] = e.target.value.split(":");
                setSortColumn(col as keyof Order);
                setSortDirection(dir as "asc" | "desc");
              }}
            >
              <option value="createdAt:desc">Newest first</option>
              <option value="createdAt:asc">Oldest first</option>
              <option value="grandTotal:desc">Highest total</option>
              <option value="grandTotal:asc">Lowest total</option>
              <option value="customerName:asc">Customer A–Z</option>
              <option value="customerName:desc">Customer Z–A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {/* ✅ removed Order ID column, keep Actions visible */}
          <table className="w-full min-w-[980px]">
            <thead className="bg-orange-600 sticky top-0 z-10">
              <tr className="text-xs uppercase tracking-wide text-white">
                <th
                  onClick={() => handleSort("createdAt")}
                  className="px-6 py-4 text-left cursor-pointer whitespace-nowrap"
                >
                  Created Time
                </th>
                <th
                  onClick={() => handleSort("customerName")}
                  className="px-6 py-4 text-left cursor-pointer whitespace-nowrap"
                >
                  Customer
                </th>
                <th className="px-6 py-4 text-left whitespace-nowrap">Phone</th>
                <th className="px-6 py-4 text-left whitespace-nowrap">Guests</th>
                <th
                  onClick={() => handleSort("grandTotal")}
                  className="px-6 py-4 text-right cursor-pointer whitespace-nowrap"
                >
                  Total
                </th>
                <th className="px-6 py-4 text-left whitespace-nowrap">Status</th>

                {/* ✅ Sticky Actions Header */}
                <th className="px-6 py-4 text-right whitespace-nowrap sticky right-0 bg-orange-600 z-20">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`border-t hover:bg-orange-50/40 transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {formatCreatedAt(order.createdAt)}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.customerName}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{order.phoneNumber}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{order.guestCount}</td>

                  <td className="px-6 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">
                    ${order.grandTotal.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-orange-200 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* ✅ Sticky Actions Cell */}
                  <td className="px-6 py-4 text-right whitespace-nowrap sticky right-0 bg-white z-10">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center justify-center rounded-xl border bg-white px-3 py-2 text-orange-700 hover:bg-orange-50"
                      title="View details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty */}
        {filteredOrders.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-gray-900 font-semibold">No orders found</p>
            <p className="text-gray-600 text-sm mt-1">Try changing filters or search keywords.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span>–{" "}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredOrders.length)}</span> of{" "}
              <span className="font-medium">{filteredOrders.length}</span>
            </div>

            <div className="flex gap-2">
              <button
                className="px-3 py-2 border rounded-xl bg-white disabled:opacity-50 hover:bg-gray-100"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-2 border rounded-xl bg-white disabled:opacity-50 hover:bg-gray-100"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusChange}
        />
      )}
    </div>
  );
}
