import "./App.css";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useRef } from "react";
function App() {
  const inputRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GMAP_API_KEY,
    libraries: ["places"],
  });
  console.log(isLoaded);
  const handleOnPlacesChanged = () => {
    let places = inputRef.current.getPlaces();
    if (!places || places.length === 0) console.log("No places found");
    const place = places[0];
    const address = place.formatted_address;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    console.log({
      address,
      lat,
      lng,
    });
  };
  return (
    <div
      style={{
        border: "1px solid white",
        width: "500px",
        height: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
            placeholder="enter your address here"
            style={{ height: "50px", width: "400px" }}
          />
        </StandaloneSearchBox>
      )}
    </div>
  );
}

export default App;
