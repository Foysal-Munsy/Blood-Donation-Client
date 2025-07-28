import { FaUsers, FaHandHoldingUsd, FaTint } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";

const AdminDashboard = ({ user, role, stats }) => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  console.log("🚀 ~ UsersList ~ s:", users);

  useEffect(() => {
    axiosSecure("/get-users")
      .then(({ data }) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // stats fallback
  const {
    totalDonor = users.length,
    totalFunding = 0,
    totalRequests = 0,
  } = stats || {};

  return (
    <div className="w-full">
      {/* Welcome Message */}
      {user && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-4 text-center overflow-hidden rounded-md shadow-md mb-6">
          <p className="text-sm md:text-base font-medium animate-pulse">
            Welcome back, <span className="font-bold">{user.displayName}</span>!
            <span className="ml-2 hidden sm:inline">Your role is {role}.</span>
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-red-500 to-rose-500 text-white rounded-xl p-6 shadow-lg flex items-center gap-4">
          <FaUsers className="text-4xl md:text-5xl text-white opacity-90" />
          <div>
            <p className="text-3xl font-bold">{totalDonor}</p>
            <p className="text-sm md:text-base font-medium">Total Donors</p>
          </div>
        </div>

        {/* Total Funding */}
        <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-xl p-6 shadow-lg flex items-center gap-4">
          <FaHandHoldingUsd className="text-4xl md:text-5xl text-white opacity-90" />
          <div>
            <p className="text-3xl font-bold">${totalFunding}</p>
            <p className="text-sm md:text-base font-medium">Total Funding</p>
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-xl p-6 shadow-lg flex items-center gap-4">
          <FaTint className="text-4xl md:text-5xl text-white opacity-90" />
          <div>
            <p className="text-3xl font-bold">{totalRequests}</p>
            <p className="text-sm md:text-base font-medium">Blood Requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
