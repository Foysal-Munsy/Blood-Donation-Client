import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <div>
          <Header />
          <main className="min-h-[calc(100vh-285px)] ">
            <Outlet></Outlet>
          </main>
          <Footer />
        </div>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default RootLayout;
