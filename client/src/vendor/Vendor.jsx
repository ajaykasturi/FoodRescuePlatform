import React, { useContext, useState } from "react";
import { Star, Edit, Trash2, Eye, Plus } from "lucide-react";
import Ratings from "./Ratings";
import Notifications from "./Notifications";
import IncomingOrders from "./IncomingOrders";
import MyListings from "./MyListings";
import AddListing from "./AddListing";
import Dashboard from "./Dashboard";
import { AuthContext } from "../context/AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export default function VendorPortal() {
  const { checkAuth, setIsAuth } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
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
        alert(data.message);
        //update auth status
        setIsAuth((_) => false);
        //fetch and update role
        await checkAuth();
        //redirect based on role
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };
  // Sidebar Navigation
  const Sidebar = () => (
    <div className="w-80 bg-linear-to-brom-green-100 to-emerald-100 min-h-screen p-6 flex flex-col shadow-xl border-r-4 border-green-200">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-12">
        <div className="w-14 h-14 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-white">FR</span>
        </div>
        <span className="font-bold text-green-900 text-lg">
          Food Rescue Platform
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-3 flex-1">
        <button
          onClick={() => setCurrentPage("dashboard")}
          className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
            currentPage === "dashboard"
              ? "bg-green-600 text-white shadow-lg"
              : "text-green-800 hover:bg-green-200"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentPage("add-listing")}
          className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
            currentPage === "add-listing"
              ? "bg-green-600 text-white shadow-lg"
              : "text-green-800 hover:bg-green-200"
          }`}
        >
          Add Food Listing
        </button>
        <button
          onClick={() => setCurrentPage("my-listings")}
          className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
            currentPage === "my-listings"
              ? "bg-green-600 text-white shadow-lg"
              : "text-green-800 hover:bg-green-200"
          }`}
        >
          My Listings
        </button>
        <button
          onClick={() => setCurrentPage("incoming-orders")}
          className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
            currentPage === "incoming-orders"
              ? "bg-green-600 text-white shadow-lg"
              : "text-green-800 hover:bg-green-200"
          }`}
        >
          Incoming Orders
        </button>
        <button
          onClick={() => setCurrentPage("notifications")}
          className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
            currentPage === "notifications"
              ? "bg-green-600 text-white shadow-lg"
              : "text-green-800 hover:bg-green-200"
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setCurrentPage("ratings")}
          className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
            currentPage === "ratings"
              ? "bg-green-600 text-white shadow-lg"
              : "text-green-800 hover:bg-green-200"
          }`}
        >
          Ratings/Feedback
        </button>
      </nav>

      {/* Logout */}
      <button
        onClick={() => handleLogout()}
        className="mt-auto px-6 py-3 bg-white rounded-full font-bold text-green-800 hover:bg-green-50 transition shadow-md border-2 border-green-200 cursor-pointer"
      >
        Logout
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar />
      {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "add-listing" && <AddListing />}
      {currentPage === "my-listings" && <MyListings />}
      {currentPage === "incoming-orders" && <IncomingOrders />}
      {currentPage === "notifications" && <Notifications />}
      {currentPage === "ratings" && <Ratings />}
    </div>
  );
}
