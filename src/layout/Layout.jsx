import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AuthProvider from "../contexts/AuthContext";
import ScrollToTop from "../components/ScrollToTop";
import ProductProvider from "../contexts/ProductContext";
import Sidebar from "./Sidebar";

const Layout = () => {
  const location = useLocation();

  // Routes where Navbar & Sidebar should be hidden
  const hideLayout = location.pathname === "/login";

  return (
    <AuthProvider>
      <ProductProvider>
        <ScrollToTop />
        {hideLayout ? (
          // If layout is hidden, just show the Outlet (page content)
          <main className="w-full min-h-screen bg-[#fdf9f9]">
            <Outlet />
          </main>
        ) : (
          // Default layout with Navbar & Sidebar
          <>
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 px-4 md:px-6 py-4 lg:px-8 lg:py-6 bg-[#fdf9f9] max-h-[95vh] overflow-y-auto">
                <Outlet />
              </main>
            </div>
          </>
        )}
      </ProductProvider>
    </AuthProvider>
  );
};

export default Layout;
