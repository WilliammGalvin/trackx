function Analytics() {
  const weeklySales = [
    { week: "Feb 24", revenue: 1240, units: 64 },
    { week: "Mar 3", revenue: 1580, units: 82 },
    { week: "Mar 10", revenue: 1320, units: 71 },
    { week: "Mar 17", revenue: 1890, units: 97 },
    { week: "Mar 24", revenue: 1650, units: 89 },
  ];

  const maxRevenue = Math.max(...weeklySales.map((w) => w.revenue));

  const categoryBreakdown = [
    { category: "Tools", pct: 28, revenue: 2340, color: "bg-gray-900" },
    { category: "Electrical", pct: 22, revenue: 1848, color: "bg-blue-600" },
    { category: "Hardware", pct: 18, revenue: 1512, color: "bg-amber-500" },
    { category: "Paint", pct: 15, revenue: 1260, color: "bg-emerald-500" },
    { category: "Plumbing", pct: 10, revenue: 840, color: "bg-violet-500" },
    { category: "Other", pct: 7, revenue: 588, color: "bg-gray-400" },
  ];

  const topProducts = [
    { rank: 1, name: 'Adjustable Wrench 10"', units: 23, revenue: 528.77 },
    { rank: 2, name: "Interior Latex Paint 3.7L", units: 14, revenue: 489.86 },
    { rank: 3, name: "Phillips Screwdriver #2", units: 18, revenue: 179.82 },
    { rank: 4, name: "Extension Cord 3m", units: 11, revenue: 164.89 },
    { rank: 5, name: 'Copper Pipe 1/2" x 3ft', units: 12, revenue: 149.88 },
  ];

  const kpis = [
    {
      label: "Revenue This Month",
      value: "$8,388",
      change: "+14.2%",
      up: true,
    },
    { label: "Units Sold", value: "403", change: "+8.7%", up: true },
    { label: "Avg. Order Value", value: "$20.81", change: "-2.1%", up: false },
    { label: "Inventory Turnover", value: "3.4x", change: "+0.6", up: true },
  ];

  return (
    <main>
      <h1 className="font-semibold text-2xl mb-1">Analytics</h1>
      <p className="text-gray-500 text-sm mb-6">
        Sales trends, category performance, and top products.
      </p>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm"
          >
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {k.label}
            </h3>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-bold text-gray-900">{k.value}</p>
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded ${k.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
              >
                {k.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Weekly Revenue Chart (CSS bar chart) */}
        <div className="lg:w-[60%] bg-white rounded-lg border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Weekly Revenue</h2>
          <p className="text-xs text-gray-400 mb-6">Last 5 weeks</p>
          <div className="flex items-end gap-3 h-48">
            {weeklySales.map((w) => (
              <div
                key={w.week}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <span className="text-xs font-semibold text-gray-900">
                  ${(w.revenue / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full bg-gray-900 rounded-t-md transition-all"
                  style={{ height: `${(w.revenue / maxRevenue) * 160}px` }}
                />
                <span className="text-xs text-gray-500">{w.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:w-[40%] bg-white rounded-lg border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-1">
            Sales by Category
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            Revenue distribution this month
          </p>
          <div className="space-y-3">
            {categoryBreakdown.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">
                    {c.category}
                  </span>
                  <span className="text-gray-500 text-xs">
                    ${c.revenue.toLocaleString()} · {c.pct}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${c.color}`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-6 bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Top Products This Month
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-50">
              <th className="px-5 py-3 font-medium w-12">#</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium text-center">Units Sold</th>
              <th className="px-5 py-3 font-medium text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p) => (
              <tr
                key={p.rank}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      p.rank === 1
                        ? "bg-amber-100 text-amber-700"
                        : p.rank === 2
                          ? "bg-gray-200 text-gray-600"
                          : p.rank === 3
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {p.rank}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-medium text-gray-900">
                  {p.name}
                </td>
                <td className="px-5 py-3.5 text-center text-gray-600">
                  {p.units}
                </td>
                <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                  ${p.revenue.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
export default Analytics;
