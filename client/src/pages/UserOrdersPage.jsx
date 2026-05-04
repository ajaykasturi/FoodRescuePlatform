import React, { useEffect, useState } from "react";
import {
  MapPin,
  Search,
  Bell,
  Heart,
  ArrowLeft,
  Eye,
  Download,
  XCircle,
} from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-2025-001",
      restaurant: "Tim Hortons - 589 University Ave",
      type: "Baked Goods",
      date: "2025-11-28",
      time: "18:00 - 23:00",
      price: "CAD $5.00",
      status: "Completed",
      pickupDate: "2025-11-28",
    },
    {
      id: "ORD-2025-002",
      restaurant: "Subway - College St",
      type: "Sandwiches",
      date: "2025-11-27",
      time: "20:00 - 22:00",
      price: "CAD $4.50",
      status: "Completed",
      pickupDate: "2025-11-27",
    },
    {
      id: "ORD-2025-003",
      restaurant: "Pizza Pizza - Dundas West",
      type: "Pizza",
      date: "2025-11-30",
      time: "19:00 - 21:00",
      price: "CAD $6.00",
      status: "Pending",
      pickupDate: "2025-11-30",
    },
    {
      id: "ORD-2025-004",
      restaurant: "Starbucks - Bay St",
      type: "Baked Goods & Drinks",
      date: "2025-11-29",
      time: "17:00 - 19:00",
      price: "CAD $7.00",
      status: "Pending",
      pickupDate: "2025-11-29",
    },
    {
      id: "ORD-2025-005",
      restaurant: "Freshii - King St",
      type: "Salads & Bowls",
      date: "2025-11-26",
      time: "18:30 - 20:00",
      price: "CAD $5.50",
      status: "Cancelled",
      pickupDate: "2025-11-26",
    },
  ];
  const [userOrders, setUserOrders] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "placed":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  const getOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/consumer/orders/my`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log(data);
      if (!data.success) {
        alert(data.message || "Something went wrong.");
        return;
      } else {
        setUserOrders(data.orders);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    getOrders();
  }, [trigger]);

  const handleCancelOrder = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/consumer/orders/${id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(data);
      if (!data.success) {
        alert(data.message || "Something went wrong.");
        return;
      } else {
        setTrigger((prev) => !prev);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your food rescue orders
          </p>
        </div>
        {userOrders?.length == 0 ? (
          <div>No Orders</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userOrders &&
                    userOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-green-50 transition`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-gray-900">
                            {order.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {order.business_name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-gray-600">{order.created_at}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-green-700">
                            {order.price}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {order.status === "placed" && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition group cursor-pointer"
                                title="Cancel Order"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
