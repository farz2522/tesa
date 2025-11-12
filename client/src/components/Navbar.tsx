// src/components/Navbar.tsx
import React from "react";
import { BellIcon, Cog6ToothIcon, MapIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white flex justify-between items-center px-6 py-3 shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
          D
        </div>
        <span className="text-xl font-semibold">DroneDefends</span>
      </div>

      {/* Menu items */}
      <ul className="flex items-center space-x-6">
        <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
        <li className="hover:text-blue-400 cursor-pointer flex items-center">
          <MapIcon className="w-5 h-5 mr-1" />
          Map
        </li>
        <li className="hover:text-blue-400 cursor-pointer">Drone List</li>
        <li className="hover:text-blue-400 cursor-pointer flex items-center">
          <BellIcon className="w-5 h-5 mr-1" />
          Alerts
        </li>
        <li className="hover:text-blue-400 cursor-pointer flex items-center">
          <Cog6ToothIcon className="w-5 h-5 mr-1" />
          Settings
        </li>
      </ul>

      {/* Profile */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold cursor-pointer">
          U
        </div>
        <span>Admin</span>
      </div>
    </nav>
  );
};

export default Navbar;
