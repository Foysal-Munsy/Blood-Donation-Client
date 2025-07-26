import { useContext, useState } from "react";
import { CgMenuMotion } from "react-icons/cg";
import { RiMenuAddLine } from "react-icons/ri";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menu = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Search", path: "/search" },
    { name: "Request", path: "/request" },
    { name: "Blog", path: "/blog" },
    { name: "Funding", path: "/funding" },

    // ...(user?.email ? [{ name: "Manage My Foods", path: "/my-foods" }] : []),
  ];

  const handleNavLinkClick = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-rose-200">
      {/* User Greeting Banner */}
      {user && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-4 text-center overflow-hidden">
          <p className="text-sm md:text-base font-medium animate-pulse">
            Welcome back, <span className="font-bold">{user.displayName}</span>!
            <span className="ml-2 hidden sm:inline">Explore it.</span>
          </p>
        </div>
      )}

      {/* Main Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent tracking-tight group-hover:scale-105 transform transition-transform duration-200">
              RedDrop
            </span>
            <span className="text-2xl group-hover:rotate-180 transform transition-transform duration-200">
              🩸
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm xl:text-base transition-all duration-200 ${
                    isActive
                      ? "bg-rose-100 text-red-900 shadow-sm"
                      : "text-gray-700 hover:text-red-700 hover:bg-rose-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user && user.email ? (
              <div className="flex items-center space-x-3">
                {user.photoURL && (
                  <div className="relative">
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-rose-300 shadow-sm hover:border-rose-500 transition-colors duration-200"
                      title={user.displayName}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-900 rounded-full border-2 border-white"></div>
                  </div>
                )}
                <button
                  onClick={logOut}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-700 hover:bg-rose-50 rounded-lg transition-all duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/registration"
                  className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {user && user.photoURL && (
              <div className="relative">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-rose-300 shadow-sm"
                  title={user.displayName}
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-red-700 hover:bg-rose-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <CgMenuMotion className="w-6 h-6" />
              ) : (
                <RiMenuAddLine className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-rose-100">
            <div className="space-y-1">
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-rose-100 text-red-900 border-l-4 border-red-500"
                        : "text-gray-700 hover:text-red-700 hover:bg-rose-50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Mobile Auth Actions */}
              <div className="pt-4 mt-4 border-t border-rose-100 space-y-2">
                {user && user.email ? (
                  <button
                    onClick={() => {
                      logOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <NavLink
                      to="/login"
                      onClick={handleNavLinkClick}
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-red-700 hover:bg-rose-50 rounded-lg transition-all duration-200"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/registration"
                      onClick={handleNavLinkClick}
                      className="block px-4 py-3 text-base font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 text-center transition-all duration-200"
                    >
                      Register
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
