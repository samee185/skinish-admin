import { useEffect, useState } from "react";
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import DashboardCard from "../components/DashboardCard";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import RecentOrders from "../components/RecentOrders";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    // Mock fetch - Replace with API call
    setSalesData([
      { month: "Jan", sales: 4000 },
      { month: "Feb", sales: 3000 },
      { month: "Mar", sales: 5000 },
      { month: "Apr", sales: 4000 },
      { month: "May", sales: 6000 },
      { month: "June", sales: 7000 },
      { month: "July", sales: 3000 },
      { month: "August", sales: 9000 },
    ]);

    setOrdersData([
      { name: "Completed", value: 500 },
      { name: "Pending", value: 200 },
      { name: "Cancelled", value: 100 },
    ]);
  }, []);

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="p-2 space-y-8 bg-[#fdf9f9]">
      {/* Stats Row */}
      <div className="flex items-center justify-center flex-wrap lg:flex-nowrap gap-6">
        <DashboardCard
          cardImg={<CurrencyDollarIcon className="h-7 w-7" />}
          title="Total Sales"
          amount="₦1,250,000"
          currentDate={today}
        />
        <DashboardCard
          cardImg={<ShoppingBagIcon className="h-7 w-7" />}
          title="Orders Completed"
          amount="540"
          currentDate={today}
        />
        <DashboardCard
          cardImg={<UsersIcon className="h-7 w-7" />}
          title="Customers"
          amount="320"
          currentDate={today}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
        {/* Sales Chart */}
        <div className="p-6 bg-white rounded-2xl shadow-md border border-[#ffe1f0]">
          <h2 className="text-lg font-semibold text-[#663333] mb-4">
            Monthly Sales
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffe1f0" />
              <XAxis dataKey="month" stroke="#663333" />
              <YAxis stroke="#663333" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#663333"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Pie */}
        <div className="p-4 bg-white rounded-2xl shadow-md border border-[#ffe1f0]">
          <h2 className="text-lg font-semibold text-[#663333] mb-4">
            Order Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ordersData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {ordersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Placeholder for future chart */}
       
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-[#ffe1f0]">
        <h2 className="text-lg font-semibold text-[#663333] mb-4">
          Recent Orders
        </h2>
        <RecentOrders />
      </div>
    </div>
  );
}


export default Dashboard;