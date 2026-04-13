"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  createOrder,
  defaultOrders,
  ORDER_STORAGE_KEY,
  ORDER_STORAGE_FULL_SNAPSHOT_KEY,
  parseStoredOrders,
  type Order,
  type OrderItem,
  type OrderStatus,
} from "./order-data";

type StatusFilter = "All" | OrderStatus;

function toInputDate(displayDate: string) {
  const parsed = new Date(displayDate);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toDisplayDate(value: string) {
  if (!value) {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("All");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [draftOrder, setDraftOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState<string>("");

  function persistOrders(nextOrders: Order[]) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(nextOrders));
    localStorage.setItem(ORDER_STORAGE_FULL_SNAPSHOT_KEY, "1");
  }

  useEffect(() => {
    const persistedOrders = parseStoredOrders(
      localStorage.getItem(ORDER_STORAGE_KEY),
    );
    const hasFullSnapshot =
      localStorage.getItem(ORDER_STORAGE_FULL_SNAPSHOT_KEY) === "1";

    if (persistedOrders.length === 0) {
      return;
    }

    if (hasFullSnapshot) {
      setOrders(persistedOrders);
      return;
    }

    const uniqueDefaults = defaultOrders.filter(
      (defaultOrder) =>
        !persistedOrders.some(
          (persistedOrder) => persistedOrder.id === defaultOrder.id,
        ),
    );

    const mergedOrders = [...persistedOrders, ...uniqueDefaults];
    setOrders(mergedOrders);
    persistOrders(mergedOrders);
  }, []);

  const statusStyle: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const statusCounts = useMemo(
    () => ({
      All: orders.length,
      Pending: orders.filter((o) => o.status === "Pending").length,
      Shipped: orders.filter((o) => o.status === "Shipped").length,
      Delivered: orders.filter((o) => o.status === "Delivered").length,
    }),
    [orders],
  );

  const filteredOrders = useMemo(() => {
    if (activeStatus === "All") {
      return orders;
    }

    return orders.filter((order) => order.status === activeStatus);
  }, [activeStatus, orders]);

  function openOrderModal(order: Order) {
    setSelectedOrderId(order.id);
    setFormError("");
    setDraftOrder({
      ...order,
      inventory: order.inventory.map((item) => ({ ...item })),
    });
  }

  function closeOrderModal() {
    setSelectedOrderId(null);
    setDraftOrder(null);
    setFormError("");
  }

  function updateDraftOrderField(
    field: "supplier" | "date" | "status",
    value: string,
  ) {
    setDraftOrder((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function updateDraftInventoryItem(
    itemId: string,
    field: "name" | "category" | "quantity" | "unitCost",
    value: string,
  ) {
    setDraftOrder((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        inventory: current.inventory.map((item) =>
          item.id === itemId
            ? {
                ...item,
                [field]: field === "quantity" || field === "unitCost" ? Number(value) : value,
              }
            : item,
        ),
      };
    });
  }

  function addDraftInventoryItem() {
    setDraftOrder((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        inventory: [
          ...current.inventory,
          {
            id: `${current.id}-item-${current.inventory.length + 1}`,
            name: "",
            category: "",
            quantity: 1,
            unitCost: 0,
          },
        ],
      };
    });
  }

  function removeDraftInventoryItem(itemId: string) {
    setDraftOrder((current) => {
      if (!current || current.inventory.length === 1) {
        return current;
      }

      return {
        ...current,
        inventory: current.inventory.filter((item) => item.id !== itemId),
      };
    });
  }

  function saveDraftOrder() {
    if (!draftOrder) {
      return;
    }

    if (!draftOrder.supplier.trim()) {
      setFormError("Supplier is required.");
      return;
    }

    if (!draftOrder.date.trim()) {
      setFormError("Date is required.");
      return;
    }

    const normalizedInventory = draftOrder.inventory
      .map((item, index) => ({
        id: item.id || `${draftOrder.id}-item-${index + 1}`,
        name: String(item.name).trim(),
        category: String(item.category).trim(),
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
      }))
      .filter(
        (item) =>
          item.name.length > 0 &&
          item.category.length > 0 &&
          Number.isFinite(item.quantity) &&
          item.quantity > 0 &&
          Number.isFinite(item.unitCost) &&
          item.unitCost >= 0,
      );

    if (normalizedInventory.length === 0) {
      setFormError("At least one valid inventory item is required.");
      return;
    }

    const updatedOrder = createOrder({
      id: draftOrder.id,
      supplier: draftOrder.supplier.trim(),
      date: toDisplayDate(draftOrder.date),
      status:
        draftOrder.status === "Shipped" || draftOrder.status === "Delivered"
          ? draftOrder.status
          : "Pending",
      inventory: normalizedInventory,
    });

    setOrders((current) => {
      const next = current.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      );
      persistOrders(next);
      return next;
    });

    closeOrderModal();
  }

  function deleteOrder(orderId: string) {
    const confirmed = confirm(`Delete order ${orderId}?`);
    if (!confirmed) {
      return;
    }

    setOrders((current) => {
      const next = current.filter((order) => order.id !== orderId);
      persistOrders(next);
      return next;
    });

    if (selectedOrderId === orderId) {
      closeOrderModal();
    }
  }

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold text-2xl">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track purchase orders and supplier deliveries.
          </p>
        </div>
        <Link
          href="/orders/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + New Order
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {Object.entries(statusCounts).map(([label, count]) => (
          <button
            key={label}
            onClick={() => setActiveStatus(label as StatusFilter)}
            className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
              activeStatus === label
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
              <th className="px-5 py-3 font-medium">Inventory</th>
              <th className="px-5 py-3 font-medium text-center">Items</th>
              <th className="px-5 py-3 font-medium text-right">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr
                key={o.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-5 py-3.5 font-semibold text-gray-900 font-mono text-xs">
                  {o.id}
                </td>
                <td className="px-5 py-3.5 text-gray-700">{o.supplier}</td>
                <td className="px-5 py-3.5 text-gray-500">{o.date}</td>
                <td className="px-5 py-3.5 text-gray-600">
                  <div
                    className="max-w-[280px] truncate"
                    title={o.inventory.map((item: OrderItem) => item.name).join(", ")}
                  >
                    {o.inventory
                      .slice(0, 2)
                      .map((item: OrderItem) => item.name)
                      .join(", ")}
                    {o.inventory.length > 2 ? ` +${o.inventory.length - 2} more` : ""}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-center text-gray-600">
                  {o.itemCount}
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
                  <button
                    onClick={() => openOrderModal(o)}
                    className="text-gray-400 hover:text-gray-700 text-xs font-medium transition-colors"
                  >
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

      {draftOrder && (
        <div className="fixed inset-0 z-50 bg-black/30 p-4 overflow-y-auto">
          <div className="mx-auto mt-8 max-w-4xl bg-white rounded-lg border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Order {draftOrder.id}</h2>
                <p className="text-xs text-gray-500 mt-0.5">View, edit, or delete this order.</p>
              </div>
              <button
                onClick={closeOrderModal}
                className="text-xs font-medium px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="text-sm text-gray-700">
                  Supplier
                  <input
                    type="text"
                    value={draftOrder.supplier}
                    onChange={(event) => updateDraftOrderField("supplier", event.target.value)}
                    className="mt-1.5 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </label>
                <label className="text-sm text-gray-700">
                  Date
                  <input
                    type="date"
                    value={toInputDate(draftOrder.date)}
                    onChange={(event) => updateDraftOrderField("date", event.target.value)}
                    className="mt-1.5 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </label>
                <label className="text-sm text-gray-700">
                  Status
                  <select
                    value={draftOrder.status}
                    onChange={(event) => updateDraftOrderField("status", event.target.value)}
                    className="mt-1.5 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Inventory</h3>
                  <button
                    type="button"
                    onClick={addDraftInventoryItem}
                    className="text-xs font-medium px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="hidden sm:grid sm:grid-cols-[1fr_140px_120px_140px_auto] gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                  <span>Item Name</span>
                  <span>Category</span>
                  <span>Quantity</span>
                  <span>Unit Cost</span>
                  <span>Action</span>
                </div>

                {draftOrder.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_140px_120px_140px_auto] gap-2"
                  >
                    <input
                      type="text"
                      value={item.name}
                      onChange={(event) =>
                        updateDraftInventoryItem(item.id, "name", event.target.value)
                      }
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={item.category}
                      onChange={(event) =>
                        updateDraftInventoryItem(item.id, "category", event.target.value)
                      }
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={item.quantity}
                      onChange={(event) =>
                        updateDraftInventoryItem(item.id, "quantity", event.target.value)
                      }
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitCost}
                      onChange={(event) =>
                        updateDraftInventoryItem(item.id, "unitCost", event.target.value)
                      }
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeDraftInventoryItem(item.id)}
                      className="text-xs font-medium px-2.5 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => deleteOrder(draftOrder.id)}
                  className="text-sm font-medium px-4 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                >
                  Delete Order
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={closeOrderModal}
                    className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveDraftOrder}
                    className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
export default Orders;
