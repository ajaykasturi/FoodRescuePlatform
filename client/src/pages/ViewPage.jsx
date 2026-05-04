import React, { useEffect, useState } from "react";
import { MapPin, Search, Bell, Heart, Star } from "lucide-react";
import { useLocation } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export default function ViewPage() {
  const location = useLocation();
  const [item, setItem] = useState("");
  const [rating, setRating] = useState("");
  const [distance, setDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listingId, setListingId] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const formattedExpiry = new Date(item.expiry_at).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/consumer/listing/${listingId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setIsLoading(false);
      console.log(data);
      if (!data.success) {
        alert(data.message || "Something went wrong.");
        return;
      } else {
        setItem(data.listing);
        setRating(data.ratingSummary);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };
  useEffect(() => {
    if (location.state?.id) {
      setListingId(location.state.id);
      setDistance(location.state.distance);
    }
  }, [location.state]);
  useEffect(() => {
    if (listingId) {
      handleSubmit();
    }
  }, [listingId]);
  const handleOrder = async () => {
    setOrderLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/consumer/order`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId: listingId }),
      });

      const data = await response.json();
      setOrderLoading(false);
      console.log(data);
      if (!data.success) {
        alert(data.message || "Something went wrong.");
        return;
      } else {
        alert(data.message);
      }
    } catch (error) {
      setOrderLoading(false);
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };
  console.log(item);
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pb-40">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Image and Store Info */}
        <div className="space-y-6">
          {/* Food Image */}
          <div
            className={`bg-linear-to-br from-gray-200 to-gray-300 rounded-3xl h-80  shadow-lg overflow-hidden`}
          >
            {item.cover_picture_url && (
              <img
                src={item.cover_picture_url}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Store Info */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-linear-to-br from-green-400 to-emerald-600 rounded-full shrink-0 overflow-hidden">
              {item.profile_picture_url && (
                <img
                  src={item.profile_picture_url}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {item.business_name} - {item.address}
              </h2>
              <p className="text-gray-600 mb-2">{item.category}</p>

              <p className="text-sm text-gray-700">
                <span className="font-semibold">Distance from you:</span>{" "}
                {distance} km
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* What you could get */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What you could get
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              {item.food_details}
            </p>

            <button
              onClick={() => handleOrder()}
              className="px-8 py-3 bg-green-400 hover:bg-green-500 rounded-full font-bold text-lg transition shadow-md cursor-pointer text-white"
            >
              {orderLoading ? "Reserving..." : "Reserve"}
            </button>
          </div>
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Item Details</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-x-2">
                <span className="text-gray-700 font-bold shrink-0">
                  Pickup Address:
                </span>
                <span className="text-gray-900 font-medium">
                  {item.pickup_address}
                </span>
              </div>
              <div className="flex items-start gap-x-2">
                <span className="text-gray-700 font-bold shrink-0">
                  Special Instructions:
                </span>
                <span className="text-gray-900 font-medium">
                  {item.special_instructions}
                </span>
              </div>
              <div className="flex items-start gap-x-2">
                <span className="text-gray-700 font-bold shrink-0">
                  The item is no longer available after:
                </span>
                <span className="text-gray-900 font-medium">
                  {formattedExpiry}
                </span>
              </div>
            </div>
          </div>
          {/* Rating Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Rating({rating.total_ratings})
              </h3>
              <div className="flex items-center space-x-1 bg-gray-800 text-white px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-sm">
                  {rating.avg_satisfaction == null
                    ? 0
                    : rating.avg_satisfaction}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Food Quality:</span>
                <span className="text-gray-900 font-bold text-lg">
                  {rating.avg_food_quality == null
                    ? 0
                    : rating.avg_food_quality}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">
                  Food Quantity:
                </span>
                <span className="text-gray-900 font-bold text-lg">
                  {rating.avg_food_quantity == null
                    ? 0
                    : rating.avg_food_quantity}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
