import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./layout/Layout";
import Home from "./pages/Home";        
import AllProducts from "./pages/AllProducts";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";  
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import SignIn from "./pages/SignIn";    

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      
      {
        element: <PrivateRoute />,
        children: [
          {path: "/", element: <Home /> },
          { path: "products", element: <AllProducts /> },
          { path: "shop/add-product", element: <AddProduct /> },
          { path: "orders", element: <Orders /> },
          { path: "shop/:productId", element: <ProductDetails /> },
          { path: "profile", element: <Profile /> },
          { path: "settings", element: <Settings /> },
          { path: "users", element: <Users /> },
        ],
      },
      { path: "signin", element: <SignIn /> },
    ],
  },
]);

export default router;
