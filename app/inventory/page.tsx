function Inventory() {
  const categories = [
    "All Categories",
    "Electrical",
    "Hardware",
    "Paint",
    "Plumbing",
    "Tools",
    "Adhesives",
    "Lighting",
  ];

  const products = [
    {
      name: "Hammer Claw 16oz",
      sku: "TLS-HC16",
      category: "Tools",
      price: 18.99,
      stock: 34,
      status: "In Stock",
    },
    {
      name: "AA Batteries (4-pack)",
      sku: "BAT-AA4",
      category: "Electrical",
      price: 6.49,
      stock: 3,
      status: "Low Stock",
    },
    {
      name: 'Duct Tape 2"',
      sku: "TAP-DT2",
      category: "Adhesives",
      price: 5.99,
      stock: 5,
      status: "Low Stock",
    },
    {
      name: "LED Bulb 60W",
      sku: "LIT-L60",
      category: "Lighting",
      price: 4.99,
      stock: 2,
      status: "Low Stock",
    },
    {
      name: "WD-40 330mL",
      sku: "LUB-WD3",
      category: "Hardware",
      price: 7.49,
      stock: 4,
      status: "Low Stock",
    },
    {
      name: "Wood Screws #8 (100pk)",
      sku: "HDW-WS8",
      category: "Hardware",
      price: 8.99,
      stock: 6,
      status: "Low Stock",
    },
    {
      name: 'Copper Pipe 1/2" x 3ft',
      sku: "PLB-CP12",
      category: "Plumbing",
      price: 12.49,
      stock: 22,
      status: "In Stock",
    },
    {
      name: "Phillips Screwdriver #2",
      sku: "TLS-PS2",
      category: "Tools",
      price: 9.99,
      stock: 41,
      status: "In Stock",
    },
    {
      name: 'Paint Roller 9"',
      sku: "PNT-PR9",
      category: "Paint",
      price: 6.99,
      stock: 1,
      status: "Low Stock",
    },
    {
      name: "Extension Cord 3m",
      sku: "ELC-EC3",
      category: "Electrical",
      price: 14.99,
      stock: 4,
      status: "Low Stock",
    },
    {
      name: 'Adjustable Wrench 10"',
      sku: "TLS-AW10",
      category: "Tools",
      price: 22.99,
      stock: 18,
      status: "In Stock",
    },
    {
      name: 'PVC Elbow 1"',
      sku: "PLB-PE1",
      category: "Plumbing",
      price: 1.89,
      stock: 67,
      status: "In Stock",
    },
    {
      name: "Interior Latex Paint 3.7L",
      sku: "PNT-IL37",
      category: "Paint",
      price: 34.99,
      stock: 15,
      status: "In Stock",
    },
    {
      name: "Wire Nuts (50pk)",
      sku: "ELC-WN50",
      category: "Electrical",
      price: 4.29,
      stock: 53,
      status: "In Stock",
    },
    {
      name: "Sandpaper 120-Grit (10pk)",
      sku: "PNT-SP12",
      category: "Paint",
      price: 5.49,
      stock: 28,
      status: "In Stock",
    },
  ];

  const statusStyle: Record<string, string> = {
    "In Stock": "bg-emerald-50 text-emerald-700",
    "Low Stock": "bg-amber-50 text-amber-700",
    "Out of Stock": "bg-red-50 text-red-700",
  };

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold text-2xl">Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your product catalog and stock levels.
          </p>
        </div>
        <button className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          + Add Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option>All Status</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium text-right">Price</th>
              <th className="px-5 py-3 font-medium text-center">Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.sku}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-5 py-3.5 font-medium text-gray-900">
                  {p.name}
                </td>
                <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">
                  {p.sku}
                </td>
                <td className="px-5 py-3.5 text-gray-600">{p.category}</td>
                <td className="px-5 py-3.5 text-right text-gray-900">
                  ${p.price.toFixed(2)}
                </td>
                <td className="px-5 py-3.5 text-center font-semibold text-gray-900">
                  {p.stock}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[p.status]}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-gray-400 hover:text-gray-700 text-xs font-medium transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
          <span>Showing 1–15 of 142 products</span>
          <div className="flex gap-1">
            <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
              Prev
            </button>
            <button className="px-2.5 py-1 rounded bg-gray-900 text-white">
              1
            </button>
            <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
export default Inventory;
