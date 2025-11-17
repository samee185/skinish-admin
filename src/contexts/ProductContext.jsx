import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

const ProductProvider = ({ children }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch all products
  const getAllProducts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [token]);

  // Create new product (expects fully-formed FormData from form)
  const createNewProduct = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/products`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product created successfully");
      await getAllProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  // Update product (without images)
  const updateProduct = async (productId, updatedData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${apiUrl}/products/${productId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, ...res.data.data } : p))
      );
      toast.success(res.data.message || "Product updated successfully");
      return res.data.data;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product images (expects FormData with images)
  const updateProductImages = async (productId, formData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${apiUrl}/products/${productId}/images`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, ...res.data.data } : p))
      );
      toast.success(res.data.message || "Images updated successfully");
      return res.data.data;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update images");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${apiUrl}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204 || res.data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success("Product deleted successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const values = {
    products,
    loading,
    setProducts,
    setLoading,
    getAllProducts,
    createNewProduct,
    updateProduct,
    updateProductImages,
    deleteProduct,
  };

  return <ProductContext.Provider value={values}>{children}</ProductContext.Provider>;
};

export default ProductProvider;
