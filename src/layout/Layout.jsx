import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AuthProvider from "../contexts/AuthContext";
import ScrollToTop from "../components/ScrollToTop";
import ProductProvider from "../contexts/ProductContext";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <AuthProvider>
        <ProductProvider>
        <Navbar />
        <ScrollToTop />
        <div className="flex">
            <Sidebar />
            <main className="flex-1 px-4 md:px-6 py-4 lg:px-8 lg:py-6 bg-[#fdf9f9] max-h-[95vh] overflow-y-auto">
                <Outlet />
            </main>
        </div>
        </ProductProvider>
    </AuthProvider>
  );
};

export default Layout;
