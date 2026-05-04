import React, { useState } from "react";
import FoodRecueTitle from "../../components/FoodRecueTitle";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useRef } from "react";
const phoneRegex = /^\+1\s\d{3}\s\d{3}\s\d{4}$/;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/consumer-register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            phoneNumber,
            password,
            confirmPassword,
            address,
            latitude,
            longitude,
            termsAccepted,
          }),
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
      navigate("/one-time-password", { state: { data } });
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };

  //gmaps api logic
  const inputRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GMAP_API_KEY,
    libraries: ["places"],
  });
  const handleOnPlacesChanged = () => {
    let places = inputRef.current.getPlaces();
    if (!places || places.length === 0) console.log("No places found");
    const place = places[0];
    const address = place.formatted_address;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setAddress(address);
    setLatitude(lat);
    setLongitude(lng);
    console.log({
      address,
      lat,
      lng,
    });
  };
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
              Create a new account
            </h1>

            <div className="space-y-6">
              {/*Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition text-gray-800 placeholder-gray-500"
                />
              </div>
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
              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition text-gray-800 placeholder-gray-500"
                />
                <span className={`text-xs`}>
                  {confirmPassword != "" &&
                    password == confirmPassword &&
                    "password matched"}
                </span>
              </div>
              {/* Location */}
              {isLoaded && (
                <StandaloneSearchBox
                  onPlacesChanged={handleOnPlacesChanged}
                  onLoad={(ref) => (inputRef.current = ref)}
                  options={{
                    componentRestrictions: { country: "CA" },
                  }}
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your address"
                      className="w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition text-gray-800 placeholder-gray-500"
                    />
                  </div>
                </StandaloneSearchBox>
              )}
              {/*Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPhoneNumber(value);
                    setIsValid(phoneRegex.test(value));
                  }}
                  placeholder="+1 234 567 8901"
                  className={`w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition text-gray-800 placeholder-gray-500  ${
                    isValid ? "border-green-500" : "border-black"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isValid ? "text-green-500" : "text-red-600"
                  }`}
                >
                  {phoneNumber != "" && isValid && "valid format"}
                </span>
              </div>
              <div className="flex justify-items-center items-center gap-x-2">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  className="size-4 accent-green-600"
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span className="text-gray-700">
                  Agree to Terms & Conditions
                </span>
              </div>
              {/* Login Button */}
              <button
                onClick={handleSignUp}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition transform hover:scale-[1.02] shadow-lg cursor-pointer"
              >
                {isLoading ? "Loading..." : "Sign Up"}
              </button>

              {/* Signup Link */}
              <div className="text-center text-gray-700">
                Already have an account?{" "}
                <a
                  onClick={() => navigate("/login")}
                  className="text-green-700 hover:text-green-600 font-bold underline cursor-pointer"
                >
                  login here
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
