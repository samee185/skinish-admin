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
    requestData.append("countInStock", product.countInStock);
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

  const updateProduct = async (productId, updatedData) => {
    setLoading(true);
    try {
      // First, let's handle the basic product data
      const productData = {
        name: String(updatedData.name || '').trim(),
        brand: String(updatedData.brand || '').trim(),
        category: Array.isArray(updatedData.category) 
          ? updatedData.category 
          : [String(updatedData.category || '').trim()], // Convert single category to array
        description: String(updatedData.description || '').trim(),
        price: Number(updatedData.price),
        discountedPrice: Number(updatedData.discountedPrice || 0),
        countInStock: Number(updatedData.countInStock),
        // backend expects `bestseller` (lowercase); accept both incoming spellings
        bestseller: Boolean(updatedData.bestSeller ?? updatedData.bestseller),
        isFeatured: Boolean(updatedData.isFeatured),
        size: String(updatedData.size || '').trim()
      };

      // Validate required fields
      const requiredFields = ['name', 'description', 'category', 'brand', 'price', 'countInStock', 'size'];
      const missingFields = requiredFields.filter(field => !productData[field] && productData[field] !== 0);
      
      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
      }

      let requestConfig = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // If there's a new image, use FormData. Otherwise send JSON.
      let response;
      if (updatedData.images && updatedData.images[0]?.startsWith('data:image')) {
        const formData = new FormData();

        // Append scalar fields
        Object.keys(productData).forEach((key) => {
          if (key === 'category') return; // handle category separately
          formData.append(key, productData[key]);
        });

        // Append category as repeated fields so backend receives an array
        if (Array.isArray(productData.category)) {
          productData.category.forEach((cat) => formData.append('category', cat));
        }

        // Handle image (base64 -> blob)
        const imgResp = await fetch(updatedData.images[0]);
        const blob = await imgResp.blob();
        formData.append('images', blob, 'image.jpg');

        // Send FormData without forcing Content-Type (axios will set boundary)
        response = await axios.put(`${apiUrl}/products/${productId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // No new image: send JSON body. Ensure category is an array.
        response = await axios.put(`${apiUrl}/products/${productId}`, productData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
      }
      
      if (response.status === 200 || response.status === 201) {
        // backend returns the updated product in response.data.data or response.data.product
        const updated = response.data.data || response.data.product || response.data;
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product._id === productId ? { ...product, ...updated } : product
          )
        );
        toast.success(response.data.message || "Product updated successfully");
        return updated;
      }
    } catch (err) {
      console.error("Error updating product:", err.message);
      err.response?.data?.message
        ? toast.error(err.response.data.message)
        : toast.error("An error occurred while updating the product");
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
