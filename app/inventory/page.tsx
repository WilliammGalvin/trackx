"use client";

import { useState } from "react";

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

  const statusStyle: Record<string, string> = {
    "In Stock": "bg-emerald-50 text-emerald-700",
    "Low Stock": "bg-amber-50 text-amber-700",
    "Out of Stock": "bg-red-50 text-red-700",
  };

  const [products, setProducts] = useState([
    { name: "Hammer Claw 16oz", sku: "TLS-HC16", category: "Tools", price: 18.99, stock: 34, status: "In Stock" },
    { name: "AA Batteries (4-pack)", sku: "BAT-AA4", category: "Electrical", price: 6.49, stock: 3, status: "Low Stock" },
    { name: 'Duct Tape 2"', sku: "TAP-DT2", category: "Adhesives", price: 5.99, stock: 5, status: "Low Stock" },
    { name: "LED Bulb 60W", sku: "LIT-L60", category: "Lighting", price: 4.99, stock: 2, status: "Low Stock" },
    { name: "WD-40 330mL", sku: "LUB-WD3", category: "Hardware", price: 7.49, stock: 4, status: "Low Stock" },
    { name: "Wood Screws #8 (100pk)", sku: "HDW-WS8", category: "Hardware", price: 8.99, stock: 6, status: "Low Stock" },
    { name: 'Copper Pipe 1/2" x 3ft', sku: "PLB-CP12", category: "Plumbing", price: 12.49, stock: 22, status: "In Stock" },
    { name: "Phillips Screwdriver #2", sku: "TLS-PS2", category: "Tools", price: 9.99, stock: 41, status: "In Stock" },
    { name: 'Paint Roller 9"', sku: "PNT-PR9", category: "Paint", price: 6.99, stock: 1, status: "Low Stock" },
    { name: "Extension Cord 3m", sku: "ELC-EC3", category: "Electrical", price: 14.99, stock: 4, status: "Low Stock" },
    { name: 'Adjustable Wrench 10"', sku: "TLS-AW10", category: "Tools", price: 22.99, stock: 18, status: "In Stock" },
    { name: 'PVC Elbow 1"', sku: "PLB-PE1", category: "Plumbing", price: 1.89, stock: 67, status: "In Stock" },
    { name: "Interior Latex Paint 3.7L", sku: "PNT-IL37", category: "Paint", price: 34.99, stock: 15, status: "In Stock" },
    { name: "Wire Nuts (50pk)", sku: "ELC-WN50", category: "Electrical", price: 4.29, stock: 53, status: "In Stock" },
    { name: "Sandpaper 120-Grit (10pk)", sku: "PNT-SP12", category: "Paint", price: 5.49, stock: 28, status: "In Stock" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSku, setEditingSku] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "Tools",
    price: "",
    stock: "",
  });

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
        selectedCategory === "All Categories" ||
        p.category === selectedCategory;

    const matchesStatus =
        selectedStatus === "All Status" ||
        p.status === selectedStatus;

    const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleSaveProduct = () => {
    const stockNum = Number(newProduct.stock);

    const status =
        stockNum === 0
            ? "Out of Stock"
            : stockNum <= 5
                ? "Low Stock"
                : "In Stock";

    const productData = {
      ...newProduct,
      price: Number(newProduct.price),
      stock: stockNum,
      status,
    };

    if (editingSku) {
      setProducts((prev) =>
          prev.map((p) => (p.sku === editingSku ? productData : p))
      );
    } else {
      setProducts((prev) => [...prev, productData]);
    }

    resetForm();
  };

  const handleDeleteProduct = (sku: string) => {
    if (!confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p.sku !== sku));
  };

  const handleEditClick = (product: any) => {
    setNewProduct({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setEditingSku(product.sku);
    setShowModal(true);
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      sku: "",
      category: "Tools",
      price: "",
      stock: "",
    });
    setEditingSku(null);
    setShowModal(false);
  };

  return (
      <main>
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">Inventory</h1>

          <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg"
          >
            + Add Product
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="border px-3 py-2 rounded w-full"
          />

          <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border px-3 py-2 rounded"
          >
            {categories.map((c) => (
                <option key={c}>{c}</option>
            ))}
          </select>

          <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border px-3 py-2 rounded"
          >
            <option>All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>

        <table className="w-full text-sm border">
          <thead>
          <tr className="bg-gray-50 text-left text-xs uppercase">
            <th className="p-3">Product</th>
            <th className="p-3">SKU</th>
            <th className="p-3">Category</th>
            <th className="p-3 text-right">Price</th>
            <th className="p-3 text-center">Stock</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
          </thead>

          <tbody>
          {filteredProducts.map((p) => (
              <tr key={p.sku} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-xs text-gray-500">{p.sku}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3 text-right">${p.price.toFixed(2)}</td>
                <td className="p-3 text-center">{p.stock}</td>
                <td className="p-3">
                <span className={`px-2 py-1 text-xs rounded ${statusStyle[p.status]}`}>
                  {p.status}
                </span>
                </td>

                <td className="p-3 text-right space-x-2">
                  <button
                      onClick={() => handleEditClick(p)}
                      className="text-blue-500 text-xs"
                  >
                    Edit
                  </button>

                  <button
                      onClick={() => handleDeleteProduct(p.sku)}
                      className="text-red-500 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        {showModal && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-white p-6 rounded w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">
                  {editingSku ? "Edit Product" : "Add Product"}
                </h2>

                <div className="space-y-3">
                  <input
                      placeholder="Name"
                      value={newProduct.name}
                      onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                  />

                  <input
                      placeholder="SKU"
                      value={newProduct.sku}
                      onChange={(e) =>
                          setNewProduct({ ...newProduct, sku: e.target.value })
                      }
                      disabled={!!editingSku}
                      className="w-full border p-2 rounded"
                  />

                  <select
                      value={newProduct.category}
                      onChange={(e) =>
                          setNewProduct({ ...newProduct, category: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                  >
                    {categories.slice(1).map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                  </select>

                  <input
                      type="number"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={(e) =>
                          setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                  />

                  <input
                      type="number"
                      placeholder="Stock"
                      value={newProduct.stock}
                      onChange={(e) =>
                          setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={resetForm}>Cancel</button>
                  <button
                      onClick={handleSaveProduct}
                      className="bg-gray-900 text-white px-4 py-2 rounded"
                  >
                    {editingSku ? "Save Changes" : "Add"}
                  </button>
                </div>
              </div>
            </div>
        )}
      </main>
  );
}

export default Inventory;