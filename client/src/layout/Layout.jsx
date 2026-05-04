import { useEffect } from "react";

import { useLocation } from "react-router-dom";
import ConsumerHeader from "../components/ConsumerHeader";
import Footer from "../components/Footer";

function Layout({ children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      <ConsumerHeader />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
