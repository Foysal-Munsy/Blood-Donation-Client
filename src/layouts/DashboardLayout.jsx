// DashboardLayout.jsx
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import { HelmetProvider } from "react-helmet-async";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DashboardLayout = () => {
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
