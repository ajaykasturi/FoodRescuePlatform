// Incoming Orders Page
const IncomingOrders = () => {
  const orders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      item: "Veg Sandwich Box",
      quantity: 2,
      pickupTime: "18:00 - 19:00",
      status: "Pending",
      phone: "+1(226) 675 9876",
    },
    {
      id: "ORD-002",
      customer: "Alice K",
      item: "Pasta Bowl",
      quantity: 1,
      pickupTime: "19:30 - 20:30",
      status: "Confirmed",
      phone: "+1(226) 123 4567",
    },
    {
      id: "ORD-003",
      customer: "Bob M",
      item: "Fruit Pack",
      quantity: 3,
      pickupTime: "17:00 - 18:00",
      status: "Completed",
      phone: "+1(226) 987 6543",
    },
  ];

  return (
    <div className="flex-1 bg-linear-to-b from-green-50 to-white p-8">
      <h1 className="text-4xl font-bold text-green-900 mb-4">
        Incoming Orders
      </h1>
      <p className="text-green-800 mb-8">
        View and manage customer orders for your food listings.
      </p>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-300">
        <table className="w-full">
          <thead className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Order ID</th>
              <th className="px-6 py-4 text-left font-bold">Customer</th>
              <th className="px-6 py-4 text-left font-bold">Item</th>
              <th className="px-6 py-4 text-left font-bold">Quantity</th>
              <th className="px-6 py-4 text-left font-bold">Pickup Time</th>
              <th className="px-6 py-4 text-left font-bold">Phone</th>
              <th className="px-6 py-4 text-left font-bold">Status</th>
              <th className="px-6 py-4 text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {orders.map((order, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-green-50"
                } hover:bg-green-100 transition`}
              >
                <td className="px-6 py-4 font-bold text-green-800">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-gray-900">{order.customer}</td>
                <td className="px-6 py-4 text-gray-900">{order.item}</td>
                <td className="px-6 py-4 text-gray-900">{order.quantity}</td>
                <td className="px-6 py-4 text-gray-900">{order.pickupTime}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.phone}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                        : order.status === "Confirmed"
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-green-100 text-green-800 border border-green-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 shadow-md">
                      Confirm
                    </button>
                    <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 shadow-md">
                      Contact
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomingOrders;
