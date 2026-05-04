import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useContext(AuthContext);

  if (isAuth === null || isAuth == false) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
