import React, { useContext, useState } from "react";
import FoodRecueTitle from "../../components/FoodRecueTitle";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuth, checkAuth } = useContext(AuthContext);
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      setIsLoading(false);
      console.log(data);
      if (!data.success) {
        alert(data.message || "Something went wrong.");
        return;
      } else {
        //update auth status
        setIsAuth((_) => true);
        //fetch and update role
        await checkAuth();
        //redirect based on role
        if (data.role === "vendor") {
          navigate("/vendor");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white flex flex-col">
      {/* Header with Logo */}
      <div className="p-6">
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="w-16 h-16 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white">FR</span>
          </div>
          <span>
            <FoodRecueTitle className="text-2xl" />
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Quote */}
          <div className="text-center mb-8">
            <p className="text-xl text-gray-700 font-medium">
              "Saving food means feeding hope." 🌱
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
              Log into your account
            </h1>

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition text-gray-800 placeholder-gray-500"
                />

                {/* Toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[46px] text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Forgot Password Link */}
              {/* <div className="text-left">
                <a
                  onClick={() => navigate("/reset-password")}
                  className="text-sm text-green-700 hover:text-green-600 font-medium underline cursor-pointer"
                >
                  Forgot password
                </a>
              </div> */}

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition transform hover:scale-[1.02] shadow-lg cursor-pointer"
              >
                {isLoading ? "Logging in" : "Login"}
              </button>

              {/* Signup Link */}
              <div className="text-center text-gray-700">
                Don't have an account?{" "}
                <a
                  onClick={() => navigate("/signup")}
                  className="text-green-700 hover:text-green-600 font-bold underline cursor-pointer"
                >
                  Signup here
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600 bg-linear-to-b from-transparent to-green-50">
        © Food Rescue Platform, 2025 - All rights reserved
      </footer>
    </div>
  );
}
