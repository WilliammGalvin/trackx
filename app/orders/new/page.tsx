"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createOrder,
  defaultOrders,
  getNextOrderId,
  ORDER_STORAGE_KEY,
  ORDER_STORAGE_FULL_SNAPSHOT_KEY,
  parseStoredOrders,
  type OrderItem,
  type OrderStatus,
} from "../order-data";

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

type OrderItemDraft = {
  id: string;
  name: string;
  category: string;
  quantity: string;
  unitCost: string;
};

function createDraftItem(id: string): OrderItemDraft {
  return {
    id,
    name: "",
    category: "",
    quantity: "1",
    unitCost: "0",
  };
}

function NewOrderPage() {
  const router = useRouter();
  const [draftItems, setDraftItems] = useState<OrderItemDraft[]>([
    createDraftItem("draft-1"),
  ]);

  function addItemRow() {
    setDraftItems((current) => [
      ...current,
      createDraftItem(`draft-${current.length + 1}`),
    ]);
  }

  function updateItemRow(
    draftId: string,
    field: "name" | "category" | "quantity" | "unitCost",
    value: string,
  ) {
    setDraftItems((current) =>
      current.map((item) =>
        item.id === draftId ? { ...item, [field]: value } : item,
      ),
    );
  }

  function removeItemRow(draftId: string) {
    setDraftItems((current) =>
      current.length === 1 ? current : current.filter((item) => item.id !== draftId),
    );
  }

  function buildInventoryForOrder(orderId: string) {
    return draftItems
      .map((item, index) => {
        const quantity = Number(item.quantity);
        const unitCost = Number(item.unitCost);
        const name = item.name.trim();
        const category = item.category.trim();

        if (!name || !Number.isFinite(quantity) || quantity <= 0) {
          return null;
        }

        if (!category) {
          return null;
        }

        if (!Number.isFinite(unitCost) || unitCost < 0) {
          return null;
        }

        return {
          id: `${orderId}-item-${index + 1}`,
          name,
          category,
          quantity,
          unitCost,
        } satisfies OrderItem;
      })
      .filter((item): item is OrderItem => item !== null);
  }

  function handleSubmit(formData: FormData) {
    const supplierValue = String(formData.get("supplier") ?? "").trim();
    const expectedDate = String(formData.get("expectedDate") ?? "").trim();
    const statusValue = String(formData.get("status") ?? "Pending") as OrderStatus;

    if (!supplierValue) {
      return;
    }

    const existing = parseStoredOrders(localStorage.getItem(ORDER_STORAGE_KEY));
    const hasFullSnapshot =
      localStorage.getItem(ORDER_STORAGE_FULL_SNAPSHOT_KEY) === "1";

    const baseOrders = hasFullSnapshot
      ? existing
      : [
          ...existing,
          ...defaultOrders.filter(
            (defaultOrder) =>
              !existing.some((existingOrder) => existingOrder.id === defaultOrder.id),
          ),
        ];

    const nextOrderId = getNextOrderId(baseOrders);
    const inventory = buildInventoryForOrder(nextOrderId);

    if (inventory.length === 0) {
      return;
    }

    const newOrder = createOrder({
      id: nextOrderId,
      supplier: supplierValue,
      date: toDisplayDate(expectedDate),
      inventory,
      status:
        statusValue === "Shipped" || statusValue === "Delivered"
          ? statusValue
          : "Pending",
    });

    localStorage.setItem(
      ORDER_STORAGE_KEY,
      JSON.stringify([newOrder, ...baseOrders]),
    );
    localStorage.setItem(ORDER_STORAGE_FULL_SNAPSHOT_KEY, "1");

    router.push("/orders");
  }

  return (
    <main>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-semibold text-2xl">New Order</h1>
            <p className="text-gray-500 text-sm mt-1">
              Create a purchase order and send it to a supplier.
            </p>
          </div>
          <Link
            href="/orders"
            className="text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>

        <form
          action={handleSubmit}
          className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-sm text-gray-700">
              Supplier
              <input
                type="text"
                name="supplier"
                required
                placeholder="e.g. VoltSupply Co."
                className="mt-1.5 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </label>
            <label className="text-sm text-gray-700">
              Expected Delivery Date
              <input
                type="date"
                name="expectedDate"
                required
                className="mt-1.5 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </label>
          </div>

          <label className="text-sm text-gray-700 block">
            Status
            <select
              name="status"
              defaultValue="Pending"
              required
              className="mt-1.5 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </label>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Order Inventory</h2>
              <button
                type="button"
                onClick={addItemRow}
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

            {draftItems.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_140px_120px_140px_auto] gap-2"
              >
                <input
                  type="text"
                  value={item.name}
                  required
                  onChange={(event) =>
                    updateItemRow(item.id, "name", event.target.value)
                  }
                  placeholder={`Item ${index + 1} name`}
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <input
                  type="text"
                  value={item.category}
                  required
                  onChange={(event) =>
                    updateItemRow(item.id, "category", event.target.value)
                  }
                  placeholder="Category"
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={item.quantity}
                  required
                  onChange={(event) =>
                    updateItemRow(item.id, "quantity", event.target.value)
                  }
                  placeholder="Qty"
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.unitCost}
                  required
                  onChange={(event) =>
                    updateItemRow(item.id, "unitCost", event.target.value)
                  }
                  placeholder="Unit Cost"
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeItemRow(item.id)}
                  className="text-xs font-medium px-2.5 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <label className="text-sm text-gray-700 block">
            Notes
            <textarea
              name="notes"
              rows={4}
              placeholder="Optional notes for this order"
              className="mt-1.5 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </label>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Save Order
            </button>
            <Link
              href="/orders"
              className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default NewOrderPage;
