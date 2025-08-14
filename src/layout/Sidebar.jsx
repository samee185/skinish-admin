import React from "react";
import {
  PlusCircleIcon,
  BuildingStorefrontIcon,
  HomeIcon,
  UserCircleIcon,
  ShoppingBagIcon
} from "@heroicons/react/24/outline";
import { FaBox } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: HomeIcon },
  { to: "/shop/add-product", label: "Add Products", icon: PlusCircleIcon },
  { to: "/products", label: "Store", icon: BuildingStorefrontIcon },
  { to: "/orders", label: "Orders", icon: ShoppingBagIcon },
  { to: "/profile", label: "Profile", icon: UserCircleIcon }
];

const Sidebar = () => {
  return (
    <div className="h-screen w-[90px] lg:w-[270px] flex flex-col items-end bg-[#ffe1f0] border-r border-[#663333]/20 shadow-lg">
      <nav className="flex flex-col gap-6 mt-20 w-full px-3 lg:pl-8 lg:pr-2 py-8 md:py-10">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 
              ${
                isActive
                  ? "bg-[#663333] text-white shadow-md"
                  : "text-[#663333] hover:bg-[#663333]/10"
              }`
            }
          >
            <Icon className="h-6 w-6 flex-shrink-0" />
            <span className="hidden lg:block font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
