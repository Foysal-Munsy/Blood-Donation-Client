import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-red-500 to-rose-500 text-white py-8 mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl font-black bg-white bg-clip-text text-transparent tracking-tight">
            RedDrop
          </span>
          <span className="text-2xl">🩸</span>
        </div>

        {/* Links */}
        <div className="flex justify-center space-x-6 text-sm">
          <Link to="/" className="hover:underline hover:text-gray-100">
            Home
          </Link>
          <Link to="/search" className="hover:underline hover:text-gray-100">
            Search Donor
          </Link>
          <Link to="/blog" className="hover:underline hover:text-gray-100">
            Blog
          </Link>
          <Link to="/contact" className="hover:underline hover:text-gray-100">
            Contact
          </Link>
        </div>

        {/* CopyRight */}
        <p className="text-xs text-red-100">
          © {new Date().getFullYear()} RedDrop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
