// Sidebar.jsx
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import {
  FaHome,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaUsers,
  FaPencilAlt,
} from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import useRole from "../hooks/useRole";
import Loader from "./Loader";
import { CgProfile } from "react-icons/cg";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
    // Changed path from "" to "/dashboard" to make exact matching work
    { name: "Dashboard", path: "/dashboard", icon: <FaHome />, end: true },
    { name: "Profile", path: "/dashboard/profile", icon: <CgProfile /> },
    { name: "All Users", path: "/dashboard/all-users", icon: <FaUsers /> },
    {
      name: "All Donation Request",
      path: "/dashboard/all-blood-donation-request",
      icon: <FaClipboardList />,
    },
    {
      name: "Content Management",
      path: "/dashboard/content-management",
      icon: <FaPencilAlt />,
    },
  ];

  const donorMenu = [
    // Changed path from "" to "/dashboard" to make exact matching work
    { name: "Dashboard", path: "/dashboard", icon: <FaHome />, end: true },
    { name: "Profile", path: "/dashboard/profile", icon: <CgProfile /> },
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

  const defaultMenu = [
    // Changed path from "" to "/dashboard" to make exact matching work
    { name: "Dashboard", path: "/dashboard", icon: <FaHome />, end: true },
    { name: "Profile", path: "/dashboard/profile", icon: <CgProfile /> },
    {
      name: "All Donation Request",
      path: "/dashboard/all-blood-donation-request",
      icon: <FaClipboardList />,
    },
    {
      name: "Content Management",
      path: "/dashboard/content-management",
      icon: <FaPencilAlt />,
    },
  ];

  let menuItems = defaultMenu;

  if (role === "admin") menuItems = adminMenu;
  else if (role === "donor") menuItems = donorMenu;

  // Loading is now handled at DashboardLayout level to avoid double loaders
  // if (loading) return <Loader label="Loading sidebar..." />;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-nav border-b border-border shadow-nav z-40 flex items-center justify-between px-4">
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
        className={`fixed top-0 left-0 h-screen bg-cardBg border-r border-border shadow-lg z-50 transform transition-all duration-300 flex flex-col ${
          isMobile
            ? isOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full"
            : isOpen
            ? "w-64"
            : "w-20"
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Desktop Logo & Toggle */}
          <div className="hidden lg:flex items-center justify-between h-16 px-4 border-b border-border">
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
            <ThemeToggle />
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-border">
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

          {/* Section Label */}
          <div className="px-4 mt-4">
            <p className={`text-xs font-semibold uppercase tracking-wider text-gray-500 ${
              !isMobile && !isOpen ? "opacity-0 hidden" : ""
            }`}>
              {role === "admin" ? "Admin" : role === "donor" ? "Donor" : "Volunteer"}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col mt-4 space-y-1 px-2">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end={item.end || false} // Use the end prop to ensure exact matching
                onClick={closeSidebarOnMobile}
                title={item.name}
                aria-label={item.name}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 border-l-4 ${
                    isActive
                      ? "bg-rose-100 text-highlighted shadow-sm border-red-500"
                      : "text-text hover:text-highlighted hover:bg-rose-50 border-transparent hover:border-red-200"
                  }`
                }
              >
                <span className="text-lg flex-shrink-0 text-highlighted">{item.icon}</span>
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
        </div>

        {/* Footer */}
        <footer className="mt-auto pb-4 px-4 border-t border-rose-200/50 space-y-2">
          {role === "donor" && (
            <Link
              to="/dashboard/create-donation-request"
              onClick={() => isMobile && setIsOpen(false)}
              className={`block text-center w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 bg-cta text-btn-text hover:shadow-md ${
                !isMobile && !isOpen ? "truncate" : ""
              }`}
            >
              New Donation Request
            </Link>
          )}
          <Link
            to="/"
            onClick={() => isMobile && setIsOpen(false)}
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              !isMobile && !isOpen ? "justify-center" : "justify-start"
            } text-gray-700 hover:text-red-700 hover:bg-rose-50`}
          >
            <ArrowLeft className="text-lg flex-shrink-0" />
            {(!isMobile || isOpen) && (
              <span className="transition-opacity duration-300">
                Back to Home
              </span>
            )}
          </Link>
        </footer>
      </aside>

      {/* Mobile spacer to push content below mobile header */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default Sidebar;
