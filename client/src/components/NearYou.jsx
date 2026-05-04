import { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const NearYou = ({ limit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nearYouItems, setNearYouItems] = useState(null);
  const getListingsNearYou = async () => {
    setIsLoading(true);
    try {
      //   await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await fetch(`${API_BASE_URL}/api/consumer/near-by`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const dataRes = await response.json();
      setIsLoading(false);
      console.log(dataRes);
      if (!dataRes.success) {
        alert(dataRes.message || "Something went wrong.");
        return;
      } else {
        setNearYouItems(dataRes?.data);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getListingsNearYou();
  }, []);
  return (
    <>
      {/* Near You Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Near you</h2>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearYouItems && nearYouItems.length != 0
              ? nearYouItems
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

export default NearYou;
