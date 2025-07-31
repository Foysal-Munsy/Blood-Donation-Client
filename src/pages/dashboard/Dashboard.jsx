import React, { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useRole from "../../hooks/useRole";
import AdminDashboard from "../adminDashboard/AdminDashboard";
import DonorDashboard from "../donorDashboard/DonorDashboard";
import VolunteerDashboard from "../volunteerDashboard/VolunteerDashboard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { role, loading } = useRole();

  if (loading) {
    return <h1>Loading....</h1>;
  }

  if (role === "admin") {
    return <AdminDashboard user={user} role={role} />;
  }
  if (role === "donor") {
    return <DonorDashboard user={user} role={role} />;
  }

  return <VolunteerDashboard user={user} role={role} />;
}
