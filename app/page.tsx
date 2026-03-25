function Home() {
  const statCardInfo = [
    { title: "Total Products", value: "142", change: "+12", up: true },
    { title: "Low Stock Items", value: "7", change: "+2", up: false },
    { title: "Pending Orders", value: "3", change: "-1", up: true },
    { title: "Items Sold This Week", value: "89", change: "+23", up: true },
  ];

  const lowStockItems = [
    {
      name: "AA Batteries (4-pack)",
      sku: "BAT-AA4",
      current: 3,
      reorder: 20,
      supplier: "VoltSupply Co.",
    },
    {
      name: 'Duct Tape 2"',
      sku: "TAP-DT2",
      current: 5,
      reorder: 25,
      supplier: "AdhesivePro",
    },
    {
      name: "LED Bulb 60W",
      sku: "LIT-L60",
      current: 2,
      reorder: 30,
      supplier: "BrightPath Ltd.",
    },
    {
      name: "WD-40 330mL",
      sku: "LUB-WD3",
      current: 4,
      reorder: 15,
      supplier: "MaintenancePlus",
    },
    {
      name: "Wood Screws #8 (100pk)",
      sku: "HDW-WS8",
      current: 6,
      reorder: 40,
      supplier: "FastenAll Inc.",
    },
    {
      name: 'Paint Roller 9"',
      sku: "PNT-PR9",
      current: 1,
      reorder: 20,
      supplier: "CoatMaster",
    },
    {
      name: "Extension Cord 3m",
      sku: "ELC-EC3",
      current: 4,
      reorder: 18,
      supplier: "VoltSupply Co.",
    },
  ];

  const recentActivity = [
    {
      action: "Stock updated",
      detail: "Hammer Claw 16oz — qty set to 34",
      time: "2 min ago",
      type: "update",
    },
    {
      action: "Order placed",
      detail: "PO-1048 to VoltSupply Co.",
      time: "18 min ago",
      type: "order",
    },
    {
      action: "Low stock alert",
      detail: 'Paint Roller 9" dropped below threshold',
      time: "1 hr ago",
      type: "alert",
    },
    {
      action: "Order received",
      detail: "PO-1042 from FastenAll Inc. — 6 items",
      time: "3 hr ago",
      type: "received",
    },
    {
      action: "Price adjusted",
      detail: 'Duct Tape 2" — $5.49 → $5.99',
      time: "5 hr ago",
      type: "update",
    },
    {
      action: "New product added",
      detail: "Magnetic Stud Finder (ELC-SF1)",
      time: "Yesterday",
      type: "new",
    },
    {
      action: "Order placed",
      detail: "PO-1047 to BrightPath Ltd.",
      time: "Yesterday",
      type: "order",
    },
  ];

  const activityColors: Record<string, string> = {
    update: "bg-blue-100 text-blue-700",
    order: "bg-indigo-100 text-indigo-700",
    alert: "bg-amber-100 text-amber-700",
    received: "bg-emerald-100 text-emerald-700",
    new: "bg-violet-100 text-violet-700",
  };

  return (
    <main>
      <h1 className="font-semibold text-2xl mb-2">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">
        Overview of your inventory and recent activity.
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardInfo.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-5 shadow-sm rounded-lg border border-gray-100"
          >
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {stat.title}
            </h2>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded ${stat.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
              >
                {stat.change} this week
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <section className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Low Stock Alerts */}
        <div className="lg:w-[60%] bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Low Stock Alerts</h2>
            <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              {lowStockItems.length} items
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-50">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">SKU</th>
                  <th className="px-5 py-3 font-medium text-center">
                    In Stock
                  </th>
                  <th className="px-5 py-3 font-medium text-center">
                    Reorder Level
                  </th>
                  <th className="px-5 py-3 font-medium">Supplier</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr
                    key={item.sku}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">
                      {item.sku}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-block min-w-[2rem] text-center font-semibold px-2 py-0.5 rounded text-xs ${item.current <= 3 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {item.current}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-gray-500">
                      {item.reorder}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{item.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:w-[40%] bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((event, i) => (
              <div
                key={i}
                className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${activityColors[event.type]}`}
                    >
                      {event.action}
                    </span>
                    <p className="text-sm text-gray-700 mt-1 truncate">
                      {event.detail}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap pt-0.5">
                    {event.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
export default Home;
