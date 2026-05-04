import { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const CollectToday = ({ query, title, page, limit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [collectTodayItems, setCollectTodayItems] = useState(null);
  const getListingsNearYou = async () => {
    setIsLoading(true);
    try {
      //   await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await fetch(
        `${API_BASE_URL}/api/consumer/near-by?${query}&sort=${sorBy}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const dataRes = await response.json();
      setIsLoading(false);
      console.log(dataRes);
      if (!dataRes.success) {
        alert(dataRes.message || "Something went wrong.");
        return;
      } else {
        setCollectTodayItems(dataRes?.data);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
      setIsLoading(false);
    }
  };
  const [sorBy, setSortBy] = useState("");
  useEffect(() => {
    getListingsNearYou();
    console.log(sorBy);
  }, [query, sorBy]);
  return (
    <>
      {/* Near You Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {page && (
            <>
              <div>
                <span className="font-bold">Sort By: </span>
                <select
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    console.log(e.target.value);
                  }}
                  className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                >
                  <option value="">Relevance</option>
                  <option value="distance">Distance</option>
                  <option value="price_asc">Price(low to high)</option>
                </select>
              </div>
            </>
          )}
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collectTodayItems && collectTodayItems?.length != 0
              ? collectTodayItems
                  .slice(0, limit)
                  .map((item) => (
                    <FoodCard key={`nearby${item.id}`} item={item} />
                  ))
              : "No Items"}
          </div>
        )}
      </div>
    </>
  );
};

export default CollectToday;
