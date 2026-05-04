import { MoreVertical, MapPin, Search, Bell, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
const FoodCard = ({ item }) => {
  const address = item.address.split(",");
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/listing/view`, {
          state: { id: item.id, distance: item.distance },
        })
      }
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-200 cursor-pointer"
    >
      {/* Card Image/Placeholder */}
      <div className="relative bg-linear-to-br from-gray-200 to-gray-300 h-40">
        {/* Logo Circle */}
        {item.cover_picture_url && (
          <img
            src={item.cover_picture_url}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute bottom-3 left-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
          <div className="bg-linear-to-br from-green-400 to-emerald-600 rounded-full w-11 h-11 overflow-hidden flex items-center justify-center">
            {item.profile_picture_url ? (
              <img
                src={item.profile_picture_url}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">🍽️</span>
            )}
          </div>
        </div>

        {/* More Options */}
        {/* <button className="absolute top-3 right-3 w-10 h-5 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 text-sm">
        4.5
      </button> */}

        {/* Heart Icon */}
        {/* <button
        onClick={() => toggleFavorite(item.id)}
        className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition"
      >
        <Heart
          className={`w-5 h-5 ${
            favorites?.includes(item.id)
              ? "fill-red-500 text-red-500"
              : "text-gray-600"
          }`}
        />
      </button> */}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-bold text-sm text-gray-900 mb-1">
          {item.legal_name} -{" "}
          <span className="text">
            {item?.food_details?.substring(0, 20)}...
          </span>
        </h3>
        <span className="flex items-center gap-1 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          {address[0]}
        </span>

        <p className="text-sm text-gray-600 mb-2">{item.distance} km</p>
        {/* <p className="text-xs text-gray-700 mb-3">{item.price}</p> */}

        {/* Price Info */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm font-medium line-through">
            CAD$ {item.actual_price}
          </span>
          <span className="text-green-600 font-bold text-lg">
            CAD$ {item.discounted_price}
          </span>
        </div>
      </div>
    </div>
  );
};
export default FoodCard;
