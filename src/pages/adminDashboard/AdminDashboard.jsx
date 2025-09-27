import { FaUsers, FaHandHoldingUsd, FaTint } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";

const AdminDashboard = ({ user, role, stats }) => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [request, setRequest] = useState([]);
  const donors = users.filter((user) => user.role === "donor");

  useEffect(() => {
    axiosSecure("/get-users")
      .then(({ data }) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    axiosSecure("/all-donation-requests")
      .then(({ data }) => setRequest(data))
      .catch((err) => console.error("Error fetching donation requests:", err));
  }, []);

  // stats fallback
  const {
    totalDonor = donors.length,
    totalFunding = 0,
    totalRequests = request.length,
  } = stats || {};

  return (
    <div className="w-full">
      <PageTitle title={"Admin Dashboard"} />
      {/* Welcome Message */}
      {user && (
        <div className="bg-cta text-btn-text py-3 px-4 text-center overflow-hidden rounded-md shadow-md mb-6">
          <p className="text-sm md:text-base font-medium">
            Welcome back, <span className="font-bold">{user.displayName}</span>!
            <span className="ml-2 hidden sm:inline">Your role is {role}.</span>
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-[#dc2626] to-[#be123c] text-btn-text rounded-xl p-6 shadow-lg flex items-center gap-4">
          <FaUsers className="text-4xl md:text-5xl opacity-90" />
          <div>
            <p className="text-3xl font-bold">{totalDonor}</p>
            <p className="text-sm md:text-base font-medium">Total Donors</p>
          </div>
        </div>

        {/* Total Funding */}
        <div className="bg-gradient-to-br from-[#be123c] to-[#881337] text-btn-text rounded-xl p-6 shadow-lg flex items-center gap-4">
          <FaHandHoldingUsd className="text-4xl md:text-5xl opacity-90" />
          <div>
            <p className="text-3xl font-bold">${totalFunding}</p>
            <p className="text-sm md:text-base font-medium">Total Funding</p>
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-gradient-to-br from-[#881337] to-[#dc2626] text-btn-text rounded-xl p-6 shadow-lg flex items-center gap-4">
          <FaTint className="text-4xl md:text-5xl opacity-90" />
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
