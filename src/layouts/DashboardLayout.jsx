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
    //   <QueryClientProvider client={QueryClient}>
    <HelmetProvider>
      <div className="min-h-screen ">
        <Sidebar />
        <main className="transition-all duration-300 lg:ml-64">
          {/* className="p-4 sm:p-6 lg:p-8" */}
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </HelmetProvider>
    // </QueryClientProvider>
  );
};

export default DashboardLayout;
