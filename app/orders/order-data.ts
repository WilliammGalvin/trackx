export type OrderStatus = "Pending" | "Shipped" | "Delivered";

export type OrderItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitCost: number;
};

type OrderItemInput = Omit<OrderItem, "category"> & {
  category?: string;
};

export type Order = {
  id: string;
  supplier: string;
  date: string;
  inventory: OrderItem[];
  itemCount: number;
  total: number;
  status: OrderStatus;
};

export const ORDER_STORAGE_KEY = "trackx-orders";
export const ORDER_STORAGE_FULL_SNAPSHOT_KEY = "trackx-orders-full-snapshot";

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateTotals(inventory: OrderItemInput[]) {
  const itemCount = inventory.reduce((count, item) => count + item.quantity, 0);
  const total = roundCurrency(
    inventory.reduce((sum, item) => sum + item.quantity * item.unitCost, 0),
  );

  return { itemCount, total };
}

export function createOrder(input: {
  id: string;
  supplier: string;
  date: string;
  inventory: OrderItemInput[];
  status: OrderStatus;
}): Order {
  const normalizedInventory: OrderItem[] = input.inventory.map((item) => ({
    ...item,
    category:
      typeof item.category === "string" && item.category.trim().length > 0
        ? item.category.trim()
        : "General",
  }));

  const totals = calculateTotals(normalizedInventory);

  return {
    ...input,
    inventory: normalizedInventory,
    itemCount: totals.itemCount,
    total: totals.total,
  };
}

function legacyInventoryFromRaw(raw: any): OrderItem[] {
  const qty =
    typeof raw?.items === "number" && Number.isFinite(raw.items) ? raw.items : 1;
  const legacyTotal =
    typeof raw?.total === "number" && Number.isFinite(raw.total) ? raw.total : 0;
  const unitCost = qty > 0 ? roundCurrency(legacyTotal / qty) : 0;

  return [
    {
      id: "legacy-item-1",
      name: "Legacy Item",
      category: "General",
      quantity: Math.max(1, qty),
      unitCost,
    },
  ];
}

export function normalizeOrder(raw: any): Order | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  if (typeof raw.id !== "string" || typeof raw.supplier !== "string") {
    return null;
  }

  const status: OrderStatus =
    raw.status === "Shipped" || raw.status === "Delivered"
      ? raw.status
      : "Pending";

  const date =
    typeof raw.date === "string" && raw.date.trim().length > 0
      ? raw.date
      : new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

  const inventory = Array.isArray(raw.inventory)
    ? raw.inventory
        .map((item: any, index: number) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const name =
            typeof item.name === "string" && item.name.trim().length > 0
              ? item.name.trim()
              : `Item ${index + 1}`;

          const quantity = Number(item.quantity);
          const unitCost = Number(item.unitCost);
          const category =
            typeof item.category === "string" && item.category.trim().length > 0
              ? item.category.trim()
              : "General";

          if (!Number.isFinite(quantity) || quantity <= 0) {
            return null;
          }

          if (!Number.isFinite(unitCost) || unitCost < 0) {
            return null;
          }

          return {
            id:
              typeof item.id === "string" && item.id.trim().length > 0
                ? item.id
                : `${raw.id}-item-${index + 1}`,
            name,
            category,
            quantity,
            unitCost,
          } satisfies OrderItem;
        })
        .filter((item: OrderItem | null): item is OrderItem => item !== null)
    : legacyInventoryFromRaw(raw);

  if (inventory.length === 0) {
    return null;
  }

  return createOrder({
    id: raw.id,
    supplier: raw.supplier,
    date,
    inventory,
    status,
  });
}

export function parseStoredOrders(rawStorageValue: string | null): Order[] {
  if (!rawStorageValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawStorageValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((raw) => normalizeOrder(raw))
      .filter((order): order is Order => order !== null);
  } catch {
    return [];
  }
}

export function getNextOrderId(existingOrders: Order[]) {
  const maxId = existingOrders
    .map((o) => Number(o.id.replace("PO-", "")))
    .filter((n) => Number.isFinite(n))
    .reduce((max, n) => Math.max(max, n), 0);

  return `PO-${maxId + 1}`;
}

export const defaultOrders: Order[] = [
  createOrder({
    id: "PO-1048",
    supplier: "VoltSupply Co.",
    date: "Mar 25, 2026",
    status: "Pending",
    inventory: [
      { id: "PO-1048-1", name: "AA Batteries (4-pack)", quantity: 10, unitCost: 6.49 },
      { id: "PO-1048-2", name: "Extension Cord 3m", quantity: 8, unitCost: 14.99 },
      { id: "PO-1048-3", name: "Wire Nuts (50pk)", quantity: 6, unitCost: 4.29 },
    ],
  }),
  createOrder({
    id: "PO-1047",
    supplier: "BrightPath Ltd.",
    date: "Mar 24, 2026",
    status: "Pending",
    inventory: [
      { id: "PO-1047-1", name: "LED Bulb 60W", quantity: 12, unitCost: 4.99 },
      { id: "PO-1047-2", name: "Paint Roller 9\"", quantity: 7, unitCost: 6.99 },
    ],
  }),
  createOrder({
    id: "PO-1046",
    supplier: "CoatMaster",
    date: "Mar 23, 2026",
    status: "Shipped",
    inventory: [
      { id: "PO-1046-1", name: "Interior Latex Paint 3.7L", quantity: 9, unitCost: 34.99 },
      { id: "PO-1046-2", name: "Sandpaper 120-Grit (10pk)", quantity: 18, unitCost: 5.49 },
    ],
  }),
  createOrder({
    id: "PO-1045",
    supplier: "FastenAll Inc.",
    date: "Mar 21, 2026",
    status: "Pending",
    inventory: [
      { id: "PO-1045-1", name: "Wood Screws #8 (100pk)", quantity: 20, unitCost: 8.99 },
      { id: "PO-1045-2", name: "WD-40 330mL", quantity: 5, unitCost: 7.49 },
    ],
  }),
  createOrder({
    id: "PO-1044",
    supplier: "MaintenancePlus",
    date: "Mar 20, 2026",
    status: "Shipped",
    inventory: [
      { id: "PO-1044-1", name: "Hammer Claw 16oz", quantity: 12, unitCost: 18.99 },
      { id: "PO-1044-2", name: "Adjustable Wrench 10\"", quantity: 4, unitCost: 22.99 },
      { id: "PO-1044-3", name: "Phillips Screwdriver #2", quantity: 10, unitCost: 9.99 },
    ],
  }),
  createOrder({
    id: "PO-1043",
    supplier: "AdhesivePro",
    date: "Mar 18, 2026",
    status: "Delivered",
    inventory: [
      { id: "PO-1043-1", name: "Duct Tape 2\"", quantity: 15, unitCost: 5.99 },
      { id: "PO-1043-2", name: "Sandpaper 120-Grit (10pk)", quantity: 10, unitCost: 5.49 },
    ],
  }),
  createOrder({
    id: "PO-1042",
    supplier: "FastenAll Inc.",
    date: "Mar 17, 2026",
    status: "Delivered",
    inventory: [
      { id: "PO-1042-1", name: "Wood Screws #8 (100pk)", quantity: 30, unitCost: 8.99 },
      { id: "PO-1042-2", name: "PVC Elbow 1\"", quantity: 80, unitCost: 1.89 },
      { id: "PO-1042-3", name: "Copper Pipe 1/2\" x 3ft", quantity: 12, unitCost: 12.49 },
    ],
  }),
  createOrder({
    id: "PO-1041",
    supplier: "VoltSupply Co.",
    date: "Mar 15, 2026",
    status: "Delivered",
    inventory: [
      { id: "PO-1041-1", name: "AA Batteries (4-pack)", quantity: 25, unitCost: 6.49 },
      { id: "PO-1041-2", name: "LED Bulb 60W", quantity: 35, unitCost: 4.99 },
      { id: "PO-1041-3", name: "Extension Cord 3m", quantity: 12, unitCost: 14.99 },
    ],
  }),
  createOrder({
    id: "PO-1040",
    supplier: "BrightPath Ltd.",
    date: "Mar 13, 2026",
    status: "Delivered",
    inventory: [
      { id: "PO-1040-1", name: "LED Bulb 60W", quantity: 20, unitCost: 4.99 },
      { id: "PO-1040-2", name: "Wire Nuts (50pk)", quantity: 14, unitCost: 4.29 },
    ],
  }),
  createOrder({
    id: "PO-1039",
    supplier: "CoatMaster",
    date: "Mar 10, 2026",
    status: "Delivered",
    inventory: [
      { id: "PO-1039-1", name: "Interior Latex Paint 3.7L", quantity: 6, unitCost: 34.99 },
      { id: "PO-1039-2", name: "Paint Roller 9\"", quantity: 9, unitCost: 6.99 },
      { id: "PO-1039-3", name: "Sandpaper 120-Grit (10pk)", quantity: 12, unitCost: 5.49 },
    ],
  }),
];
