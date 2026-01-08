import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchRevenueSummary } from "../api/revenue";

type RevenuePoint = { date: string; revenue: number };
type TopItem = { name: string; revenue: number; orders: number };

type RevenueResponse = {
  days: number;
  total_revenue: number;
  avg_order_value: number;
  highest_order: number;
  revenue_over_time: RevenuePoint[];
  revenue_by_delivery_type: { delivery: number; pickup: number };
  top_items: TopItem[];
  date_range: { start: string; end: string };
};

export default function Revenue() {
  const [data, setData] = useState<RevenueResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchRevenueSummary(8);
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalRevenue = data?.total_revenue ?? 0;
  const avgOrderValue = data?.avg_order_value ?? 0;
  const highestOrder = data?.highest_order ?? 0;

  const revenueOverTime = data?.revenue_over_time ?? [];
  const maxRevenue = useMemo(() => Math.max(1, ...revenueOverTime.map((d) => d.revenue)), [revenueOverTime]);
  const chartHeight = 200;

  const deliveryRevenue = data?.revenue_by_delivery_type?.delivery ?? 0;
  const pickupRevenue = data?.revenue_by_delivery_type?.pickup ?? 0;

  const dateLabel = useMemo(() => {
    if (!data?.date_range) return "";
    const start = new Date(data.date_range.start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const end = new Date(data.date_range.end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${start} - ${end}`;
  }, [data]);

  if (loading) return <div className="p-8">Loading revenue…</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue</h1>
        <p className="text-gray-600">Track your catering revenue and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {/* optional: later compute % change */}
              +12.5%
            </span>
          </div>
          <div className="mb-1">
            <div className="text-3xl font-bold text-gray-900">
              ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mb-1">
            <div className="text-3xl font-bold text-gray-900">
              ${avgOrderValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-sm text-gray-600">Average Order Value</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-orange-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mb-1">
            <div className="text-3xl font-bold text-gray-900">
              ${highestOrder.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-sm text-gray-600">Highest Order</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Revenue Over Time</h2>
            <p className="text-sm text-gray-600 mt-1">Last {data?.days ?? 8} days</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{dateLabel}</span>
          </div>
        </div>

        <div className="relative" style={{ height: chartHeight + 60 }}>
          <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
            {revenueOverTime.map((p, index) => {
              const barHeight = (p.revenue / maxRevenue) * chartHeight;
              const isHighest = p.revenue === maxRevenue;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    ${(p.revenue / 1000).toFixed(1)}k
                  </div>
                  <div
                    className={`w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer ${
                      isHighest
                        ? "bg-gradient-to-t from-orange-500 to-orange-400"
                        : "bg-gradient-to-t from-orange-400 to-orange-300"
                    }`}
                    style={{ height: `${barHeight}px` }}
                    title={`$${p.revenue.toFixed(2)}`}
                  />
                  <div className="text-xs text-gray-600 mt-2">
                    {new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Delivery Type</h3>
          <div className="space-y-4">
            {[
              { type: "Delivery", revenue: deliveryRevenue, color: "bg-gradient-to-r from-blue-500 to-blue-600" },
              { type: "Pickup", revenue: pickupRevenue, color: "bg-gradient-to-r from-green-500 to-green-600" },
            ].map((row) => {
              const percentage = totalRevenue > 0 ? (row.revenue / totalRevenue) * 100 : 0;

              return (
                <div key={row.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{row.type}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${row.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`h-3 rounded-full ${row.color}`} style={{ width: `${percentage}%` }} />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{percentage.toFixed(1)}% of total revenue</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Items by Revenue</h3>
          <div className="space-y-3">
            {(data?.top_items ?? []).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-600">{item.orders} orders</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">${item.revenue.toFixed(2)}</div>
                </div>
              </div>
            ))}

            {(data?.top_items ?? []).length === 0 && (
              <div className="text-sm text-gray-600">No items found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
