import { createContext, useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [role, setRole] = useState(null);
  const checkAuth = async () => {
    try {
      //Check consumer token
      const consumerRes = await fetch(
        `${API_BASE_URL}/api/auth/validate-consumer-token`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const consumerData = await consumerRes.json();
      if (consumerData.userId) {
        setIsAuth(true);
        setRole(consumerData.userRole);
        return;
      }
      //Check vendor token
      const vendorRes = await fetch(
        `${API_BASE_URL}/api/auth/validate-vendor-token`,
        { method: "POST", credentials: "include" }
      );
      const vendorData = await vendorRes.json();
      if (vendorData.userId) {
        setIsAuth(true);
        setRole(vendorData.userRole);
        return;
      }
      // If both fail then user not logged in
      setIsAuth(false);
      setRole(null);
    } catch (error) {
      setIsAuth(false);
      setRole(null);
    }
  };

  useEffect(() => {
    checkAuth(); // check on page load or refresh
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, role, checkAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
