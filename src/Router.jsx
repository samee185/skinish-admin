import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import AllProducts from "./pages/AllProducts";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import Users from "./pages/Users";
// import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { 
        index: true, 
        element: <Home /> 
      },
      { 
        path: "products", 
        element: <AllProducts />  
      },
      { 
        path: "shop/add-product", 
        element: <AddProduct /> 
      },
      { 
        path: "orders", 
        element: <Orders /> 
      },
      { 
        path: "shop/:productId", 
        element: <ProductDetails /> 
      },
      { 
        path: "profile", 
        element: <Profile /> 
      },
      { 
        path: "settings", 
        element: <Settings /> 
      }, 
      { 
        path: "login", 
        element: <SignIn /> 
      },
      { 
        path: "users", 
        element: <Users /> 
      },

      
    //   {
    //     element: <PrivateRoute />, 
    //     children: [
    //       { 
    //         path: "wishlist", 
    //         element: <Wishlist /> 
    //       },
    //       { 
    //         path: "checkout", 
    //         element: <CheckoutPage /> 
    //       },
    //     ],
    //   },
    ],
  },
]);

export default router;
