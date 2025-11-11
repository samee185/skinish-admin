// contexts/OrderContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

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
  const updateOrderDeliveryStatus = async (orderId, status) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(`${apiUrl}/orders/${orderId}`, { status },{
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update locally
      setOrders(prev =>
        prev.map(order => (order._id === orderId ? { ...order, deliveryStatus: data.deliveryStatus } : order))
      );
      toast.success("Delivery status updated");
      return data;
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

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        updateOrderDeliveryStatus,
        updateOrderPaymentStatus,
        addOrder,
        deleteOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
