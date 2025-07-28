// DashboardLayout.jsx
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DashboardLayout = () => {
  return (
    //   <QueryClientProvider client={QueryClient}>
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="transition-all duration-300 lg:ml-64">
        {/* className="p-4 sm:p-6 lg:p-8" */}
        <div>
          <Outlet />
        </div>
      </main>
    </div>
    // </QueryClientProvider>
  );
};

export default DashboardLayout;
