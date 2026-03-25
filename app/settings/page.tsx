function Settings() {
  const suppliers = [
    {
      name: "VoltSupply Co.",
      email: "orders@voltsupply.ca",
      phone: "(514) 555-0112",
      leadTime: "2–3 days",
      status: "Active",
    },
    {
      name: "BrightPath Ltd.",
      email: "supply@brightpath.ca",
      phone: "(514) 555-0198",
      leadTime: "3–4 days",
      status: "Active",
    },
    {
      name: "CoatMaster",
      email: "wholesale@coatmaster.com",
      phone: "(438) 555-0234",
      leadTime: "2–3 days",
      status: "Active",
    },
    {
      name: "FastenAll Inc.",
      email: "orders@fastenall.ca",
      phone: "(514) 555-0167",
      leadTime: "1–2 days",
      status: "Active",
    },
    {
      name: "MaintenancePlus",
      email: "sales@maintenanceplus.ca",
      phone: "(438) 555-0301",
      leadTime: "3–5 days",
      status: "Active",
    },
    {
      name: "AdhesivePro",
      email: "info@adhesivepro.ca",
      phone: "(514) 555-0089",
      leadTime: "4–5 days",
      status: "Inactive",
    },
  ];

  const users = [
    {
      name: "Rowan McFaul",
      role: "Store Owner",
      email: "rowan@trackx.demo",
      status: "Active",
    },
    {
      name: "Mohamed Elzarka",
      role: "Store Employee",
      email: "mohamed@trackx.demo",
      status: "Active",
    },
    {
      name: "William Galvin",
      role: "Supplier Contact",
      email: "william@trackx.demo",
      status: "Active",
    },
  ];

  return (
    <main>
      <h1 className="font-semibold text-2xl mb-1">Settings</h1>
      <p className="text-gray-500 text-sm mb-6">
        Manage store configuration, suppliers, and user accounts.
      </p>

      <div className="space-y-6">
        {/* Store Information */}
        <section className="bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Store Information</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Store Name
              </label>
              <input
                type="text"
                defaultValue="TrackX Hardware"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Owner
              </label>
              <input
                type="text"
                defaultValue="Rowan McFaul"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="rowan@trackx.demo"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Phone
              </label>
              <input
                type="tel"
                defaultValue="(514) 555-0142"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Address
              </label>
              <input
                type="text"
                defaultValue="1234 Rue Sainte-Catherine, Montréal, QC H3B 1A7"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
            <button className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Save Changes
            </button>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Notification Preferences
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {[
              {
                label: "Low stock alerts",
                desc: "Get notified when a product drops below its reorder level.",
                on: true,
              },
              {
                label: "Order status updates",
                desc: "Receive updates when order status changes.",
                on: true,
              },
              {
                label: "Weekly summary report",
                desc: "Email digest of sales and inventory every Monday.",
                on: false,
              },
              {
                label: "Price change alerts",
                desc: "Notification when supplier prices change.",
                on: true,
              },
            ].map((pref) => (
              <div
                key={pref.label}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {pref.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{pref.desc}</p>
                </div>
                <div
                  className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${pref.on ? "bg-gray-900" : "bg-gray-200"}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${pref.on ? "left-5" : "left-1"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suppliers */}
        <section className="bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Suppliers</h2>
            <button className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              + Add Supplier
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-50">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Lead Time</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr
                    key={s.name}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {s.name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{s.email}</td>
                    <td className="px-5 py-3 text-gray-600">{s.phone}</td>
                    <td className="px-5 py-3 text-gray-500">{s.leadTime}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* User Accounts */}
        <section className="bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">User Accounts</h2>
            <button className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              + Invite User
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {users.map((u) => (
              <div
                key={u.email}
                className="px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {u.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {u.name}
                    </p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {u.role}
                  </span>
                  <button className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
export default Settings;
