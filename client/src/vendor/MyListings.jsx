// My Listings Page
const MyListings = () => {
  const listings = [
    {
      id: 101,
      name: "Veg Sandwich Box",
      status: "Active",
      expiry: "01/11 18:0",
      price: "5.4",
      bags: 5,
    },
    {
      id: 101,
      name: "Pasta Bowl",
      status: "Expried",
      expiry: "01/11 18:0",
      price: "6.4",
      bags: 3,
    },
    {
      id: 102,
      name: "Fruit Pack",
      status: "Sold",
      expiry: "01/11 18:0",
      price: "4.4",
      bags: 2,
    },
  ];

  return (
    <div className="flex-1 bg-linear-to-b from-green-50 to-white p-8">
      <h1 className="text-4xl font-bold text-green-900 mb-4">My Listings</h1>
      <p className="text-green-800 mb-8">
        Manage all your food listings here. View, Edit, or Remove active, sold,
        or expired posts.
      </p>

      <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-300">
        <table className="w-full">
          <thead className="border-b-2 border-green-600">
            <tr>
              <th className="text-left py-4 font-bold text-green-900">ID</th>
              <th className="text-left py-4 font-bold text-green-900">
                Food Details
              </th>
              <th className="text-left py-4 font-bold text-green-900">
                Status
              </th>
              <th className="text-left py-4 font-bold text-green-900">
                Expiry
              </th>
              <th className="text-left py-4 font-bold text-green-900">
                Price($)
              </th>
              <th className="text-left py-4 font-bold text-green-900">
                No. Bags
              </th>
              <th className="text-left py-4 font-bold text-green-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-green-100 hover:bg-green-50 transition"
              >
                <td className="py-4 text-gray-900">{item.id}</td>
                <td className="py-4 text-gray-900">{item.name}</td>
                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Sold"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-4 text-gray-900">{item.expiry}</td>
                <td className="py-4 text-green-700 font-bold">${item.price}</td>
                <td className="py-4 text-gray-900">{item.bags}</td>
                <td className="py-4 text-green-700 font-medium">
                  <span>Edit | Delete | View</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MyListings;
