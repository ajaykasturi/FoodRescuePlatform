import { useState } from "react";
import { MapPin, Search, Bell, Heart } from "lucide-react";
import FoodCard from "../../components/FoodCard";
import ConsumerHeader from "../../components/ConsumerHeader";
import NearYou from "../../components/NearYou";
import CollectToday from "../../components/CollectToday";

export default function ConsumerLoginHomePage() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Near You Section */}
        <NearYou limit={8} />
        {/* Collect Today Section */}
        <CollectToday title={"Collect Today"} query={"today=true"} limit={8} />
        {/* Grocery Section */}
        <CollectToday
          title={"Groceries"}
          query={"category=grocery"}
          limit={8}
        />
        {/* Prepared Section */}
        <CollectToday
          title={"Prepared"}
          query={"category=prepared"}
          limit={8}
        />
      </main>
    </>
  );
}
