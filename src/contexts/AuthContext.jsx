import React,{ createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUser(localStorage.getItem("user"));
  }, []);
  const login = async (data) => {
    setLoading(true);
    axios
      .post(`${apiUrl}/auth/admin/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setToken(res.data.data.token);
        setUser(res.data.data.user);
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        navigate("/");
        toast.success("Login Successful")
      })
      .catch((err) => {
        err?.response
          ? toast.error(err.response.data.message)
          : toast.error("An error occured");
          console.log(err.response?.data?.message);
          
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const values = {
    loading,
    token,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
