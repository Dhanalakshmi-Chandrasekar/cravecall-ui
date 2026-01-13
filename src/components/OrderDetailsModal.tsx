import { X, User, Phone, Calendar, Clock, Users, MapPin, Package } from "lucide-react";
import { Order, OrderStatus } from "../types";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

export default function OrderDetailsModal({ order, onClose, onStatusUpdate }: OrderDetailsModalProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      Preparing: "bg-orange-100 text-orange-700 border-orange-200",
      Ready: "bg-green-100 text-green-700 border-green-200",
      Delivered: "bg-gray-100 text-gray-700 border-gray-200",
      Cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  // ✅ prevent "Invalid Date"
  const safeDate = (() => {
    const d = new Date(order.eventDate || order.createdAt || "");
    return isNaN(d.getTime()) ? null : d;
  })();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-600 mt-1">Order ID: {order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{order.phoneNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Event Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {safeDate
                      ? safeDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{order.eventTime || "-"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{order.guestCount} guests</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Delivery Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Type:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    order.deliveryType === "Delivery" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.deliveryType}
                </span>
              </div>

              {!!order.address && (
                <div className="flex items-start gap-2">
                  <span className="text-sm text-gray-600">Address:</span>
                  <span className="text-sm font-medium text-gray-900">{order.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 uppercase flex items-center gap-2">
                <Package className="w-4 h-4" />
                Ordered Items
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Item</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Qty</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Unit Price</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {order.items?.length ? (
                    order.items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{item.type}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">${Number(item.unitPrice).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                          ${Number(item.totalPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-4 text-sm text-gray-500" colSpan={5}>
                        No items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Delivery Fee</span>
                <span className="text-sm font-medium text-gray-900">${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tax</span>
                <span className="text-sm font-medium text-gray-900">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">Grand Total</span>
                  <span className="text-xl font-bold text-orange-600">${order.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {!!order.specialInstructions && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-amber-900 mb-2">Special Instructions</h3>
              <p className="text-sm text-amber-800">{order.specialInstructions}</p>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Update Order Status</label>

            <select
              value={order.status}
              onChange={(e) => onStatusUpdate(order.id, e.target.value as OrderStatus)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <div className="mt-3">
              <span className={`px-4 py-2 rounded-lg text-sm font-medium border inline-block ${getStatusColor(order.status)}`}>
                Current Status: {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
