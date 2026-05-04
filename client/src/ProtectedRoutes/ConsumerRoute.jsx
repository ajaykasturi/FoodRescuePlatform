import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const ConsumerRoute = ({ children }) => {
  const { isAuth, role } = useContext(AuthContext);
  console.log(isAuth, role);
  if (isAuth === null) return <div>Loading...</div>;

  if (!isAuth) return <Navigate to="/login" replace />;

  if (role !== "consumer") return <Navigate to="/unauthorized" replace />;

  return children;
};
