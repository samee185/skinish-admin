// contexts/OrderContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useProduct } from "./ProductContext";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { products } = useProduct();
  const adminId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))._id : null;   

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apiUrl}/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      ); 
      setOrders(data.data.orders || []);
      console.log(data);
      
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Update delivery status
  const updateOrderDeliveryStatus = async (orderId, deliveryStatus) => {
  try {
    setLoading(true);
    const { data } = await axios.patch(
      `${apiUrl}/orders/${orderId}`,
      { deliveryStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedOrder = data.data.order;

    // Update state with new delivery status
    setOrders(prev =>
      prev.map(order =>
        order._id === orderId ? updatedOrder : order
      )
    );

    toast.success("Delivery status updated successfully");
    return updatedOrder;
  } catch (error) {
    console.error("Failed to update delivery status:", error);
    toast.error("Failed to update delivery status");
    throw error;
  } finally {
    setLoading(false);
  }
};


  // Update payment status
  const updateOrderPaymentStatus = async (orderId, status) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(`${apiUrl}/orders/${orderId}`, { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update locally
      setOrders(prev =>
        prev.map(order => (order._id === orderId ? { ...order, paymentStatus: data.paymentStatus } : order))
      );
      toast.success("Payment status updated");
      return data;
    } catch (error) {
      console.error("Failed to update payment status:", error);
      toast.error("Failed to update payment status");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add a new order (optional)
  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  // Delete an order (optional)
  const deleteOrder = async (orderId) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.filter(order => order._id !== orderId));
      toast.success("Order deleted");
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error("Failed to delete order");
    } finally {
      setLoading(false);
    }
  };
    // Product selection logic
  const addProduct = (product) => {
    if (!selectedProducts.some(p => p.productId === product._id)) {
      setSelectedProducts(prev => [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          brand: product.brand || "",
          image: product.image || ""
        }
      ]);
    }
  };
  
  const removeProduct = (index) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, quantity) => {
    setSelectedProducts(prev =>
      prev.map((p, i) => (i === index ? { ...p, quantity } : p))
    );
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  };
const addOrderByAdmin = async (customerInfo, shippingInfo, paymentInfo, onClose) => {
    if (!customerInfo.name || !customerInfo.email || selectedProducts.length === 0) {
      toast.error("Please fill all required fields and add at least one product");
      return;
    }

    const payload = {
      user: adminId,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      products: selectedProducts.map(p => ({
        product: p.productId,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        brand: p.brand,
        image: p.image
      })),
      shippingInfo,
      paymentInfo,
      totalAmount: calculateTotal()
    };

    try {
      setLoading(true);
      const { data } = await axios.post(`${apiUrl}/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Order added successfully");
      setOrders(prev => [...prev, data.order]);
      setSelectedProducts([]);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        updateOrderDeliveryStatus,
        updateOrderPaymentStatus,
        addOrder,
        addOrderByAdmin,
        addProduct,
        removeProduct,
        updateQuantity,
        calculateTotal,
        deleteOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
