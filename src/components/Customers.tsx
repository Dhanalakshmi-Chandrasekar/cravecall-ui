import { Users, Phone, ShoppingBag, DollarSign, Award } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchCustomersSummary } from "../api/customers";

type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpend: number;
};

type CustomersSummaryResponse = {
  total_customers: number;
  total_spend: number;
  avg_spend_per_customer: number;
  top_customer: CustomerRow | null;
  customers: CustomerRow[];
};

export default function Customers() {
  const [data, setData] = useState<CustomersSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCustomersSummary();
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalCustomers = data?.total_customers ?? 0;
  const totalSpend = data?.total_spend ?? 0;
  const avgSpendPerCustomer = data?.avg_spend_per_customer ?? 0;
  const topCustomerName = data?.top_customer?.name?.split(" ")[0] ?? "-";

  const sortedCustomers = useMemo(() => {
    return (data?.customers ?? []).slice().sort((a, b) => b.totalSpend - a.totalSpend);
  }, [data]);

  if (loading) return <div className="p-8">Loading customers…</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">View and manage your repeat customers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mb-1">
            <div className="text-3xl font-bold text-gray-900">{totalCustomers}</div>
          </div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mb-1">
            <div className="text-3xl font-bold text-gray-900">
              ${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="text-sm text-gray-600">Total Customer Spend</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-orange-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mb-1">
            <div className="text-3xl font-bold text-gray-900">
              ${avgSpendPerCustomer.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="text-sm text-gray-600">Avg Spend per Customer</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-amber-50 p-3 rounded-lg">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mb-1">
            <div className="text-2xl font-bold text-gray-900">{topCustomerName}</div>
          </div>
          <div className="text-sm text-gray-600">Top Customer</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Customer List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Number of Orders</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Spend</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Order Value</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {sortedCustomers.map((customer, index) => {
                const avgOrderValue = customer.orderCount ? customer.totalSpend / customer.orderCount : 0;
                const isTopThree = index < 3;

                return (
                  <tr key={customer.id} className={`hover:bg-gray-50 transition-colors ${isTopThree ? "bg-amber-50/30" : ""}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isTopThree && (
                          <Award
                            className={`w-5 h-5 ${
                              index === 0 ? "text-amber-500" : index === 1 ? "text-gray-400" : "text-orange-600"
                            }`}
                          />
                        )}
                        <span className="font-semibold text-gray-900">#{index + 1}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {(customer.name || "U")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{customer.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{customer.orderCount}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-green-600">
                        ${customer.totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">
                        ${avgOrderValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {sortedCustomers.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTE: Loyalty + insights blocks are still mock text.
          If you want these to be real too, we can compute from orders. */}
    </div>
  );
}
