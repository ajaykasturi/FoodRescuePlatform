import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/HomePage";
import Spinner from "./components/loading/Spinner";
import { Suspense, useContext } from "react";
import Login from "./pages/auth/Login";
import OTP from "./pages/auth/OTP";
import Signup from "./pages/auth/Signup";
import BusinessSignup from "./pages/auth/BusinessSignup";
import UnAuthorized from "./components/UnAuthorized";
import { AuthContext } from "./context/AuthContext";
import FoodRecueTitle from "./components/FoodRecueTitle";
import ConsumerLoginHomePage from "./pages/Home/ConsumerLoginHomePage";
import SearchPage from "./pages/ConsumerSearchPage";
import ConsumerHeader from "./components/ConsumerHeader";
import Layout from "./layout/Layout";
import ViewPage from "./pages/ViewPage";
import Profile from "./pages/ProfilePage";
import OrdersPage from "./pages/UserOrdersPage";
import VendorPortal from "./vendor/Vendor";
function App() {
  const { isAuth, role } = useContext(AuthContext);
  console.log(isAuth, role);
  return (
    <BrowserRouter>
      <Routes>
        {isAuth == false && (
          <Route
            path="/"
            element={
              <Suspense fallback={<Spinner />}>
                <Home />
              </Suspense>
            }
          />
        )}
        {isAuth === true && role == "vendor" && (
          <>
            <Route
              path="/"
              element={
                <Suspense fallback={<Spinner />}>
                  <VendorPortal />
                </Suspense>
              }
            />
          </>
        )}

        {isAuth == true && role == "consumer" && (
          <>
            <Route
              path="/"
              element={
                <Suspense fallback={<Spinner />}>
                  <Layout>
                    <ConsumerLoginHomePage />
                  </Layout>
                </Suspense>
              }
            />
            <Route
              path="/search"
              element={
                <Suspense fallback={<Spinner />}>
                  <Layout>
                    <SearchPage />
                  </Layout>
                </Suspense>
              }
            />
            <Route
              path="/listing/view"
              element={
                <Suspense fallback={<Spinner />}>
                  <Layout>
                    <ViewPage />
                  </Layout>
                </Suspense>
              }
            />
            <Route
              path="/profile"
              element={
                <Suspense fallback={<Spinner />}>
                  <Layout>
                    <Profile />
                  </Layout>
                </Suspense>
              }
            />
            <Route
              path="/orders"
              element={
                <Suspense fallback={<Spinner />}>
                  <Layout>
                    <OrdersPage />
                  </Layout>
                </Suspense>
              }
            />
          </>
        )}

        {isAuth == false && (
          <>
            <Route
              path="/login"
              element={
                <Suspense fallback={<Spinner />}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/signup"
              element={
                <Suspense fallback={<Spinner />}>
                  <Signup />
                </Suspense>
              }
            />
            <Route
              path="/business-signup"
              element={
                <Suspense fallback={<Spinner />}>
                  <BusinessSignup />
                </Suspense>
              }
            />
            <Route
              path="/one-time-password"
              element={
                <Suspense fallback={<Spinner />}>
                  <OTP />
                </Suspense>
              }
            />
          </>
        )}

        <Route
          path="/unauthorized"
          element={
            <Suspense fallback={<Spinner />}>
              <UnAuthorized />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
