import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const Dashboard = () => {
  const [reload, setReload] = useState(false);
  const [stats, setStats] = useState(null);
  const getStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vendor/stats`, {
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
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };
  const getProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/consumer/profile`, {
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
        setFormData(data.profile);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };
  useEffect(() => {
    getStats();
  }, [reload]);
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div className="flex-1 bg-linear-to-b from-green-50 to-white p-8">
      {/* Header */}
      <div className="bg-linear-to-rrom-green-100 to-emerald-100 rounded-2xl p-6 mb-8 flex justify-between items-center shadow-lg border-2 border-green-200">
        <div className="flex items-center gap-x-2">
          <h1 className="text-4xl font-bold text-green-900">Dashboard</h1>
          <button
            onClick={() => setReload((prev) => !prev)}
            className="cursor-pointer "
          >
            <RefreshCw />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-linear-to-br from-green-400 to-emerald-600 rounded-full shadow-md"></div>
          <div className="text-right">
            <p className="font-bold text-xl text-green-900">Tim Hortons</p>
            <p className="text-green-700">timhortons@tim.org</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-linear-to-br from-green-100 to-emerald-100 rounded-2xl p-8 shadow-lg text-center border-2 border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-2">
            Active Listings
          </h3>
          <p className="text-6xl font-bold text-green-700">
            {stats?.active_count}
          </p>
        </div>
        <div className="bg-linear-to-brrom-emerald-100 to-teal-100 rounded-2xl p-8 shadow-lg text-center border-2 border-emerald-200">
          <h3 className="text-sm font-semibold text-emerald-800 mb-2">
            Total Meals Served
          </h3>
          <p className="text-6xl font-bold text-emerald-700">
            {stats?.bags_served}
          </p>
        </div>
      </div>

      {/* Recent Notifications */}
      {/* <div>
        <h2 className="text-3xl font-bold text-green-900 mb-6">
          Recent Notifications
        </h2>
        <div className="space-y-4">
          <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-2xl p-6 shadow-md border-l-4 border-green-600">
            <p className="text-lg font-semibold text-green-900">
              New message from "Admin"
            </p>
          </div>
          <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-2xl p-6 shadow-md border-l-4 border-green-600">
            <p className="text-lg font-semibold text-green-900">
              You received a 5★ rating from "Customer"
            </p>
          </div>
        </div>
      </div> */}

      {/* Active Since */}
      {/* <div className="mt-8 text-right">
        <p className="text-green-700 font-medium">
          Active Since: 22nd Feb 2026
        </p>
      </div> */}
    </div>
  );
};
export default Dashboard;
