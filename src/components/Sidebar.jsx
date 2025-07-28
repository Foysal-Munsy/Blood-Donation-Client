// Sidebar.jsx
import { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router";
import {
  FaHome,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import { AuthContext } from "../providers/AuthProvider";
import useRole from "../hooks/useRole";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useContext(AuthContext);
  const { role, loading } = useRole();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const adminMenu = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "All Users", path: "/dashboard/all-users", icon: <FaUsers /> },
  ];

  const donorMenu = [
    { name: "Home", path: "/", icon: <FaHome /> },
    {
      name: "My Donation Request",
      path: "/dashboard/my-donation-requests",
      icon: <FaClipboardList />,
    },
    {
      name: "Create Donation Request",
      path: "/dashboard/create-donation-request",
      icon: <MdCreate />,
    },
  ];

  const defaultMenu = [{ name: "Home", path: "/", icon: <FaHome /> }];

  // if (!user || role === null) return null;

  let menuItems = defaultMenu;

  if (role === "admin") menuItems = adminMenu;
  else if (role === "donor") menuItems = donorMenu;
  console.log("🚀 ~ Sidebar ~ menuItems:", role, menuItems);

  if (loading) return <p>loading...</p>;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-rose-200 shadow-sm z-40 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">
            RedDrop
          </span>
          <span className="text-2xl">🩸</span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-700 hover:text-red-700 hover:bg-rose-50 transition-all duration-200"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebarOnMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-rose-200 shadow-lg z-50 transform transition-all duration-300 ${
          isMobile
            ? isOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full"
            : isOpen
            ? "w-64"
            : "w-20"
        }`}
      >
        {/* Desktop Logo & Toggle */}
        <div className="hidden lg:flex items-center justify-between h-16 px-4 border-b border-rose-200">
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <span
              className={`font-black text-xl tracking-tight bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent transition-opacity duration-300 ${
                !isOpen && "opacity-0 hidden"
              }`}
            >
              RedDrop
            </span>
            <span className="text-2xl">🩸</span>
          </Link>
          {/* <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-700 hover:text-red-700 hover:bg-rose-50 transition-all duration-200"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button> */}
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-rose-200">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2"
            onClick={closeSidebarOnMobile}
          >
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">
              RedDrop
            </span>
            <span className="text-2xl">🩸</span>
          </Link>
          <button
            onClick={closeSidebarOnMobile}
            className="p-2 rounded-lg text-gray-700 hover:text-red-700 hover:bg-rose-50 transition-all duration-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-4 space-y-1 px-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-rose-100 text-red-700 shadow-sm"
                    : "text-gray-700 hover:text-red-700 hover:bg-rose-50"
                }`
              }
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span
                className={`transition-opacity duration-300 ${
                  !isMobile && !isOpen && "opacity-0 hidden"
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile spacer to push content below mobile header */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default Sidebar;
