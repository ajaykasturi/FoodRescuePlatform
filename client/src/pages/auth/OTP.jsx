import React, { useEffect, useState } from "react";
import FoodRecueTitle from "../../components/FoodRecueTitle";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export default function OTP() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const [data, setData] = useState(location.state?.data);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!location.state?.data) {
      navigate("/"); // block direct access
    }
    setData(location.state?.data);
  }, []);
  const handleSubmit = async () => {
    setIsLoading(true);
    const bdy = { email: data.email, otp };
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/verification-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bdy),
        }
      );

      const data = await response.json();
      setIsLoading(false);
      console.log(data);
      if (!data.success) {
        alert(data.message || "Something went wrong.");
        return;
      }

      // if success then move to OTP page
      alert(data?.message + "! Login now");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white flex flex-col">
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

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-xl text-gray-700 font-medium">
              "Saving food means feeding hope." 🌱
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
              Enter your OTP sent to <br />
              <span className="text-blue-500 text-sm">{data?.email}</span>
            </h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  One Time Password (OTP) valid for {data?.otpExpiryMinutes}{" "}
                  mins
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder={`Enter OTP here`}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition text-gray-800 placeholder-gray-500"
                />
                <span className="text-red-500">{}</span>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition transform hover:scale-[1.02] shadow-lg"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>

              {/* Signup Link */}
              <div className="text-center text-gray-700">
                <a
                  onClick={() => navigate(-1)}
                  className="text-green-700 hover:text-green-600 font-bold underline cursor-pointer"
                >
                  Back
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
