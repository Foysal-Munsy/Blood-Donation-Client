import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RootLayout = () => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname.startsWith("/dashboard");
  return (
    <div>
      {!hideHeaderFooter && <Header />}
      <main className="min-h-screen">
        <Outlet></Outlet>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default RootLayout;
