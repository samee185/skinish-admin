import React, { useEffect, useState, useMemo } from "react";
import { useOrders } from "../contexts/OrdersContext";
import { toast } from "react-toastify";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const Orders = () => {
  const { orders, fetchOrders, updateOrderDeliveryStatus, loading } = useOrders();
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleDeliveryUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderDeliveryStatus(orderId, newStatus);
      toast.success("Delivery status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update delivery status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filtering and Searching
  const filteredOrders = useMemo(() => {
    return orders
      .filter(order =>
        (!filterStatus || order.deliveryStatus === filterStatus) &&
        (!searchQuery ||
          order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [orders, filterStatus, searchQuery]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by user name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef]"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2f7ef]"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Customer Name</th>
              <th className="px-4 py-2 border">Customer Email</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Delivery Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map(order => (
              <React.Fragment key={order._id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{order._id}</td>
                  <td className="px-4 py-2 border">{order.customerName}</td>
                  <td className="px-4 py-2 border">{order.customerEmail}</td>
                  <td className="px-4 py-2 border">₦{order.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-2 border">{order.deliveryStatus}</td>
                  <td className="px-4 py-2 border flex gap-2 items-center">
                    {['Pending', 'Shipped', 'Delivered'].map(status => (
                      <button
                        key={status}
                        disabled={updatingOrderId === order._id || order.deliveryStatus === status}
                        onClick={() => handleDeliveryUpdate(order._id, status)}
                        className={`px-2 py-1 rounded text-sm font-semibold border ${
                          order.deliveryStatus === status
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-100 hover:bg-blue-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="ml-2 text-gray-600 hover:text-gray-800"
                    >
                      {expandedOrderIds.includes(order._id) ? (
                        <ChevronUpIcon className="w-5 h-5" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                </tr>

                {/* Expanded order details */}
                {expandedOrderIds.includes(order._id) && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-4 py-2 border">
                      <h3 className="font-semibold mb-2">Items:</h3>
                      <div className="flex flex-col gap-2">
                        {order.items.map(item => (
                          <div key={item._id} className="flex items-center gap-4 border-b pb-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span>{item.name}</span>
                            <span>₦{item.price.toLocaleString()}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
