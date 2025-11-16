import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-red-500 to-rose-500 dark:from-slate-800 dark:to-slate-900 text-white py-8 mt-10 border-t-4 border-red-400 dark:border-rose-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl font-black bg-white dark:bg-gradient-to-r dark:from-rose-400 dark:to-red-400 bg-clip-text text-transparent tracking-tight">
            RedDrop
          </span>
          <span className="text-2xl">🩸</span>
        </div>

        {/* Links */}
        <div className="flex justify-center space-x-6 text-sm">
          <Link
            to="/"
            className="hover:underline hover:text-rose-200 dark:hover:text-rose-300 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/search"
            className="hover:underline hover:text-rose-200 dark:hover:text-rose-300 transition-colors"
          >
            Search Donor
          </Link>
          <Link
            to="/blog"
            className="hover:underline hover:text-rose-200 dark:hover:text-rose-300 transition-colors"
          >
            Blog
          </Link>
          <Link
            to="/contact"
            className="hover:underline hover:text-rose-200 dark:hover:text-rose-300 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* CopyRight */}
        <p className="text-xs text-red-100 dark:text-slate-400">
          © {new Date().getFullYear()} RedDrop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
