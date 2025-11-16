// DashboardLayout.jsx
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import { HelmetProvider } from "react-helmet-async";
import useRole from "../hooks/useRole";
import Loader from "../components/Loader";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DashboardLayout = () => {
  const { loading } = useRole();

  if (loading) {
    return (
      <HelmetProvider>
        <Loader label="Loading dashboard..." full={true} />
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-red-50/50">
        <Sidebar />
        <main className="transition-all duration-300 lg:ml-72 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </HelmetProvider>
  );
};

export default DashboardLayout;
