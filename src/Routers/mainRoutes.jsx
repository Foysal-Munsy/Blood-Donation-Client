import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Blog from "../pages/Blog";
import DashboardLayout from "../layouts/DashboardLayout";
import DonationRequest from "../pages/donorDashboard/DonationRequest";
import CreateDonationRequest from "../pages/donorDashboard/CreateDonationRequest";
import PrivateRoute from "./PrivateRoute";
import AllUsers from "../pages/adminDashboard/AllUsers";
import Profile from "../pages/dashboard/Profile";
import AllBloodDonationRequest from "../pages/adminDashboard/AllBloodDonationRequest";

const mainRoutes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },

      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "registration",
        element: <Register></Register>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    errorElement: <Error></Error>,
    children: [
      {
        path: "",
        element: (
          <PrivateRoute>
            <Dashboard></Dashboard>
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "all-users",
        element: <AllUsers />,
      },
      {
        path: "my-donation-requests",
        element: <DonationRequest />,
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },
      {
        // admin
        path: "all-blood-donation-request",
        element: <AllBloodDonationRequest />,
      },
      {
        path: "blog",
        element: <Blog></Blog>,
      },
    ],
  },
]);

export default mainRoutes;
