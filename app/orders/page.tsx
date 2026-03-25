function Orders() {
  const orders = [
    {
      id: "PO-1048",
      supplier: "VoltSupply Co.",
      date: "Mar 25, 2026",
      items: 4,
      total: 284.6,
      status: "Pending",
    },
    {
      id: "PO-1047",
      supplier: "BrightPath Ltd.",
      date: "Mar 24, 2026",
      items: 2,
      total: 149.7,
      status: "Pending",
    },
    {
      id: "PO-1046",
      supplier: "CoatMaster",
      date: "Mar 23, 2026",
      items: 5,
      total: 412.55,
      status: "Shipped",
    },
    {
      id: "PO-1045",
      supplier: "FastenAll Inc.",
      date: "Mar 21, 2026",
      items: 3,
      total: 197.4,
      status: "Pending",
    },
    {
      id: "PO-1044",
      supplier: "MaintenancePlus",
      date: "Mar 20, 2026",
      items: 6,
      total: 335.88,
      status: "Shipped",
    },
    {
      id: "PO-1043",
      supplier: "AdhesivePro",
      date: "Mar 18, 2026",
      items: 2,
      total: 86.3,
      status: "Delivered",
    },
    {
      id: "PO-1042",
      supplier: "FastenAll Inc.",
      date: "Mar 17, 2026",
      items: 6,
      total: 523.14,
      status: "Delivered",
    },
    {
      id: "PO-1041",
      supplier: "VoltSupply Co.",
      date: "Mar 15, 2026",
      items: 8,
      total: 641.2,
      status: "Delivered",
    },
    {
      id: "PO-1040",
      supplier: "BrightPath Ltd.",
      date: "Mar 13, 2026",
      items: 3,
      total: 178.47,
      status: "Delivered",
    },
    {
      id: "PO-1039",
      supplier: "CoatMaster",
      date: "Mar 10, 2026",
      items: 4,
      total: 299.96,
      status: "Delivered",
    },
  ];

  const statusStyle: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const statusCounts = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === "Pending").length,
    Shipped: orders.filter((o) => o.status === "Shipped").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold text-2xl">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track purchase orders and supplier deliveries.
          </p>
        </div>
        <button className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          + New Order
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {Object.entries(statusCounts).map(([label, count], i) => (
          <button
            key={label}
            className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
              i === 0
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
            <span className="ml-1.5 text-xs text-gray-400">{count}</span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Order ID</th>
              <th className="px-5 py-3 font-medium">Supplier</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium text-center">Items</th>
              <th className="px-5 py-3 font-medium text-right">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-5 py-3.5 font-semibold text-gray-900 font-mono text-xs">
                  {o.id}
                </td>
                <td className="px-5 py-3.5 text-gray-700">{o.supplier}</td>
                <td className="px-5 py-3.5 text-gray-500">{o.date}</td>
                <td className="px-5 py-3.5 text-center text-gray-600">
                  {o.items}
                </td>
                <td className="px-5 py-3.5 text-right font-medium text-gray-900">
                  ${o.total.toFixed(2)}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyle[o.status]}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-gray-400 hover:text-gray-700 text-xs font-medium transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Total Spent (March)
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">$3,109.20</p>
          <p className="text-xs text-gray-400 mt-1">Across 10 orders</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Avg. Delivery Time
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">3.2 days</p>
          <p className="text-xs text-gray-400 mt-1">From order to delivery</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Top Supplier
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            FastenAll Inc.
          </p>
          <p className="text-xs text-gray-400 mt-1">$720.54 this month</p>
        </div>
      </div>
    </main>
  );
}
export default Orders;
