import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const VendorRoute = ({ children }) => {
  const { isAuth, role } = useContext(AuthContext);

  if (isAuth === null) return <div>Loading...</div>;

  if (!isAuth) return <Navigate to="/login" replace />;

  if (role !== "vendor") return <Navigate to="/unauthorized" replace />;

  return children;
};
