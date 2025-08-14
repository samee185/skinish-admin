import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute =() => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Outlet/> : <Navigate to="/signin" />;
};


export default PrivateRoute;