import { MapPin, Search, Bell, Heart } from "lucide-react";
import FoodRecueTitle from "./FoodRecueTitle";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const ConsumerHeader = () => {
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { checkAuth, setIsAuth } = useContext(AuthContext);
  const getLocation = async () => {
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
        setLocation(data.profile.address);
        setName(data.profile.full_name);
        setEmail(data.profile.email);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };
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
  const menuRef = useRef(null);
  useEffect(() => {
    getLocation();
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Location */}
          <button className="flex items-center space-x-2 text-gray-900 hover:text-green-600 transition">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold text-sm">
              {location.substring(0, 20)}...
            </span>
          </button>

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer hidden sm:flex items-center space-x-1"
          >
            <div className="w-10 h-10 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-md shrink-0">
              <span className="text-lg font-bold text-white">FR</span>
            </div>
            <FoodRecueTitle mainClass="px-2" />
          </div>
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search"
                className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
          {/* Icons */}
          <div className="flex items-center space-x-3">
            {/* <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Bell className="w-5 h-5 text-gray-700" />
            </button> */}
            {/* <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Heart className="w-5 h-5 text-gray-700" />
            </button> */}

            <div className="relative">
              <button
                onMouseEnter={() => setShowProfileMenu(true)}
                onClick={() => setShowProfileMenu(true)}
                className="w-9 h-9 bg-linear-to-br from-green-400 to-emerald-600 rounded-full hover:shadow-lg transition flex items-center justify-center cursor-pointer"
              >
                <span className="text-lg font-bold text-white">
                  {name.charAt(0)}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div
                  ref={menuRef}
                  onMouseEnter={() => setShowProfileMenu(true)}
                  // onMouseLeave={() => setShowProfileMenu(false)}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">{email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full px-4 py-2 text-left hover:bg-green-50 transition flex items-center space-x-3 group cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition">
                        <span className="text-green-700">👤</span>
                      </div>
                      <span className="text-gray-700 font-medium">Profile</span>
                    </button>

                    <button
                      onClick={() => navigate("/orders")}
                      className="w-full px-4 py-2 text-left hover:bg-green-50 transition flex items-center space-x-3 group cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition">
                        <span className="text-green-700">📦</span>
                      </div>
                      <span className="text-gray-700 font-medium">Orders</span>
                    </button>

                    <div className="my-2 border-t border-gray-100"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 transition flex items-center space-x-3 group cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition ">
                        ➜]
                      </div>
                      <span className="text-red-600 font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default ConsumerHeader;
