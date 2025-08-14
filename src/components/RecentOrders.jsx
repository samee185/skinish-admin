// src/components/RecentOrders.jsx
import React from "react";

const RecentOrders = () => {
  const orders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      date: "2025-08-12",
      total: "₦25,000",
      status: "Pending",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      date: "2025-08-11",
      total: "₦45,000",
      status: "Completed",
    },
    {
      id: "#ORD-003",
      customer: "Michael Johnson",
      date: "2025-08-10",
      total: "₦15,000",
      status: "Cancelled",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3 font-medium">{order.total}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
