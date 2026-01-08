import { useEffect, useMemo, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import OrderDetailsModal from './OrderDetailsModal';
import { fetchOrders, updateOrderStatus } from '../api/orders';

/* ----------------------------------
   🔹 NORMALIZER (BACKEND → UI)
   - No Pending (as per your request)
   - Handles missing order_id by creating TEMP id
----------------------------------- */
function normalizeOrders(apiOrders: any[]): Order[] {
  return apiOrders
    .map((o: any, index: number) => {
      const normalizeStatus = (s?: string): OrderStatus => {
        const map: Record<string, OrderStatus> = {
          confirmed: 'Confirmed',
          preparing: 'Preparing',
          ready: 'Ready',
          delivered: 'Delivered',
          cancelled: 'Cancelled',
          completed: 'Delivered', // optional: treat completed as delivered in UI
        };
        return map[String(s ?? '').toLowerCase()] ?? 'Confirmed';
      };

      const id = o.order_id ?? `TEMP-${index}`;

      return {
        id,
        customerName: o.customer_name ?? o.customer?.name ?? 'Unknown',
        phoneNumber: o.phone ?? o.customer?.phone ?? '-',
        guestCount: o.guest_count ?? o.event?.guest_count ?? 0,
        deliveryType: o.delivery_type ?? o.delivery?.type ?? '-',
        address: o.address ?? o.delivery?.address?.line1 ?? '-',
        status: normalizeStatus(o.status),
        grandTotal: Number(o.grand_total_usd ?? o.pricing?.total ?? 0),
        currency: o.currency ?? 'USD',
        createdAt: o.created_at ?? new Date().toISOString(),
        items: o.items ?? [],
        specialInstructions: o.special_instructions ?? '',
      };
    })
    // keep only meaningful rows
    .filter(o => o.customerName !== 'Unknown' || o.grandTotal > 0);
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<keyof Order>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const itemsPerPage = 10;

  /* ----------------------------------
     FETCH ORDERS
     IMPORTANT: fetchOrders() MUST return RAW backend array (not pre-mapped)
  ----------------------------------- */
  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchOrders(); // raw backend response
        const normalized = normalizeOrders(Array.isArray(data) ? data : []);
        setOrders(normalized);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  /* ----------------------------------
     FILTER + SORT
  ----------------------------------- */
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(q) ||
        order.phoneNumber.includes(searchTerm) ||
        order.id.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    filtered.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortColumn, sortDirection]);

  /* ----------------------------------
     PAGINATION
  ----------------------------------- */
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (column: keyof Order) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  /* ----------------------------------
     STATUS UPDATE
     IMPORTANT: backend expects lowercase: confirmed/preparing/ready/delivered/cancelled
  ----------------------------------- */
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const backendStatus = newStatus.toLowerCase(); // "Confirmed" -> "confirmed"
      await updateOrderStatus(orderId, backendStatus);

      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Confirmed: 'bg-blue-100 text-blue-700',
      Preparing: 'bg-orange-100 text-orange-700',
      Ready: 'bg-green-100 text-green-700',
      Delivered: 'bg-gray-100 text-gray-700',
      Cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  /* ----------------------------------
     UI STATES
  ----------------------------------- */
  if (loading) return <div className="p-8">Loading orders…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border p-6 mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            placeholder="Search orders…"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          className="border px-4 py-2 rounded-lg"
          value={statusFilter}
          onChange={e => {
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
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th onClick={() => handleSort('id')} className="px-6 py-3 cursor-pointer">Order ID</th>
              <th onClick={() => handleSort('customerName')} className="px-6 py-3 cursor-pointer">Customer</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Guests</th>
              <th onClick={() => handleSort('grandTotal')} className="px-6 py-3 cursor-pointer">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map(order => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4">{order.phoneNumber}</td>
                <td className="px-6 py-4">{order.guestCount}</td>

                <td className="px-6 py-4 font-semibold">
                  ${order.grandTotal.toFixed(2)}
                </td>

                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(order.status)}`}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded"
                    title="View details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        )}

        {/* Optional pagination footer */}
        {filteredOrders.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
