import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useRole from "../hooks/useRole";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { role, loading } = useRole();
  console.log("🚀 ~ Dashboard ~ role:", role);

  if (loading) {
    return <h1>Loading....</h1>;
  }

  if (role === "admin") {
    return <div>Admin</div>;
  }

  return (
    <div>
      {/* Welcome Message */}
      {user && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-4 text-center overflow-hidden">
          <p className="text-sm md:text-base font-medium animate-pulse">
            Welcome back, <span className="font-bold">{user.displayName}</span>!
            <span className="ml-2 hidden sm:inline">Your role is {role}.</span>
          </p>
        </div>
      )}

      <p>G</p>
    </div>
  );
}
