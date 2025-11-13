import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const ProductContext = createContext();

export const useProduct = () => {
  return useContext(ProductContext);
};

const ProductProvider = ({ children }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (token) {
      getAllProducts();
    }
    
  }, [token]);

  const getAllProducts = async () => {
    setLoading(true);
    axios
      .get(`${apiUrl}/products`, {
        headers: {
          authorization: `Bearer ${token} `,
        },
      })
      .then((res) => {
        console.log(res.data.products);
        setProducts(res.data.products);
      })
      .catch((err) => {
        console.log(err);
        console.log("An Error occurred", err.message);
        // err?.response
        //   ? toast.error(err.response.data.message)
        //   : toast.error("An Error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createNewProduct = async (product) => {
    console.log("Product in context", product);
    const requestData = new FormData();
    requestData.append("name", product.name);
    requestData.append("sku", product.sku);
    requestData.append("brand", product.brand);
    if (Array.isArray(product.category)) {
      for (let i = 0; i < product.category.length; i++) {
        requestData.append('category', product.category[i]);
      }
    } else {
      requestData.append("category", product.category);
    }
    requestData.append("description", product.description);
    requestData.append("price", product.price);
    requestData.append("discountedPrice", product.discountedPrice);
    requestData.append("countInStock", product.countInStock);
    requestData.append("size", product.size);
    requestData.append("target", product.target);
    requestData.append("bestseller", product.bestseller === true ? "true" : "false");
    requestData.append("isFeatured", product.featured === true ? "true" : "false");
    // requestData.append("images", product.images);
    for (let i = 0; i < product.images.length; i++) {
      requestData.append('images', product.images[i]);
    }
    // console.log(product.images, requestData.get('images'));
    setLoading(true);
    axios
      .post(`${apiUrl}/products`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        console.log(res.data);
        toast.success("Product created successfully");
        await getAllProducts();
      })
      .catch((err) => {
        console.log(err);
        console.log("An error occurred", err.message);
        err.response.data.message
          ? toast.error(err.response.data.message)
          : toast.error("An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${apiUrl}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        toast.success("Product deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting product:", err.message);
      // err.response?.data?.message
      //   ? toast.error(err.response.data.message)
      //   : toast.error("An error occurred while deleting the product");
    } finally { 
      setLoading(false);
    }
  };

  const updateProduct = async (productId, updatedData, isFormData = false) => {
  setLoading(true);
  try {
    let payload = updatedData;
    let headers = { Authorization: `Bearer ${token}` };

    if (isFormData) {
  delete headers['Content-Type'];
} else {
  headers['Content-Type'] = 'application/json';
}


    const response = await axios.put(`${apiUrl}/products/${productId}`, payload, { headers });

    // Update local state
    const updated = response.data.data || response.data.product || response.data;
    setProducts(prev => prev.map(p => p._id === productId ? { ...p, ...updated } : p));

    toast.success(response.data.message || "Product updated successfully");
    return updated;
  } catch (err) {
    console.error("Error updating product:", err);
    toast.error(err.response?.data?.message || "Error updating product");
    throw err;
  } finally {
    setLoading(false);
  }
};



  const values = {
    products,
    setProducts,
    loading,
    setLoading,
    createNewProduct,
    deleteProduct,
    updateProduct
  };

  return (
    <ProductContext.Provider value={values}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
