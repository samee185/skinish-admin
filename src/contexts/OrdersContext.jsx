// contexts/OrderContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/orders"); // replace with your backend endpoint
      setOrders(data.orders || []);
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
      const { data } = await axios.patch(`/api/orders/${orderId}/delivery`, { status });
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
      const { data } = await axios.patch(`/api/orders/${orderId}/payment`, { status });
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
      await axios.delete(`/api/orders/${orderId}`);
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
