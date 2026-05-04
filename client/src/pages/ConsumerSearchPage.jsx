import { useLocation } from "react-router-dom";
import CollectToday from "../components/CollectToday";
import ConsumerHeader from "../components/ConsumerHeader";

const SearchPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");
  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {
          <CollectToday
            title={"Search Results"}
            query={`search=${query}`}
            page="search"
          />
        }
      </main>
    </>
  );
};

export default SearchPage;
