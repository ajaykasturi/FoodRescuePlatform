import { ArrowLeft, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useRef } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const Profile = () => {
  const [formData, setFormData] = useState({});
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    getProfile();
  }, []);
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/consumer/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.full_name,
          address: address,
          latitude: latitude,
          longitude: longitude,
        }),
      });
      console.log(response);
      const data = await response.json();

      console.log(data);
      if (!data.success) {
        alert(data.message || "Something went wrong.");
        return;
      } else {
        setFormData(data.profile);
        alert(data.message);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  };
  //gmaps
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
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile</h1>

        {/* Profile Picture */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-22 h-22 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-5xl font-bold text-white">
                {formData.full_name?.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData?.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-4 bg-white rounded-2xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                !isEditing ? "cursor-not-allowed opacity-90" : ""
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData?.email}
              disabled={true}
              className={`w-full px-3 py-4 bg-white rounded-2xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                !isEditing ? "cursor-not-allowed opacity-90" : ""
              }`}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Location *
            </label>
            {isLoaded && (
              <StandaloneSearchBox
                onPlacesChanged={handleOnPlacesChanged}
                onLoad={(ref) => (inputRef.current = ref)}
                options={{
                  componentRestrictions: { country: "CA" },
                }}
              >
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-4 bg-white rounded-2xl  font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    !isEditing ? "cursor-not-allowed opacity-90" : ""
                  }`}
                />
              </StandaloneSearchBox>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={formData?.phone_number}
              disabled={true}
              className={`w-full px-3 py-4 bg-white rounded-2xl  font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                !isEditing ? "cursor-not-allowed opacity-90" : ""
              }`}
            />
          </div>

          {/* Edit/Save Button */}
          <div className="pt-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="cursor-pointer font-bold text-gray-900 hover:text-green-700 transition"
              >
                Edit
              </button>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSave()}
                  className="px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 transition shadow-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
