import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      getAllUsers();
      getUserProfile();
    }
  }, [token]);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data.users);
    //   toast.success("Users fetched successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    //   toast.error(setError);
    console.log(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/users/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      setUserProfile(response.data.data);
    //   toast.success("User profile fetched successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      // toast.error(setError);
      console.log(err.response?.data/message)
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${apiUrl}/users/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserProfile(response.data.data);
    //   toast.success("User profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      // toast.error(setError);
      console.log(err.response?.data?.message)
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    //   toast.success("User deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      // toast.error(setError);
      console.log(err.response?.data.message);
      
    } finally {
      setLoading(false);
    }
  };

  const values = {
    users,
    userProfile,
    loading,
    error,
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    deleteUser,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
