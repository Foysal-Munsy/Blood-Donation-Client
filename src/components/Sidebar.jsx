import { useState } from "react";
import { Link, NavLink } from "react-router";
import {
  FaHome,
  FaSearch,
  FaClipboardList,
  FaBlog,
  FaDonate,
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Search", path: "/search", icon: <FaSearch /> },
    { name: "Request", path: "/request", icon: <FaClipboardList /> },
    { name: "Blog", path: "/blog", icon: <FaBlog /> },
    { name: "Funding", path: "/funding", icon: <FaDonate /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-rose-200 shadow-lg z-50 transform transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-rose-200">
        <Link to="/" className="flex items-center space-x-2 group">
          <span
            className={`font-black text-xl tracking-tight bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent transition-opacity duration-300 ${
              !isOpen && "opacity-0 hidden"
            }`}
          >
            RedDrop
          </span>
          <span className="text-2xl">🩸</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-gray-700 hover:text-red-700 hover:bg-rose-50 transition-all duration-200"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col mt-4 space-y-1">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mx-2 font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-rose-100 text-red-700 shadow-sm"
                  : "text-gray-700 hover:text-red-700 hover:bg-rose-50"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className={`${!isOpen && "opacity-0 hidden"}`}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
