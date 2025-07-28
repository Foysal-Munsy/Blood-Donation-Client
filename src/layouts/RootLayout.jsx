import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const RootLayout = () => {
  // const location = useLocation();
  // const hideHeaderFooter = location.pathname.startsWith("/dashboard");
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        {/* {!hideHeaderFooter && <Header />} */}
        <Header />
        <main className="min-h-[calc(100vh-285px)] ">
          <Outlet></Outlet>
        </main>
        <Footer />
        {/* {!hideHeaderFooter && <Footer />} */}
      </div>
    </QueryClientProvider>
  );
};

export default RootLayout;
