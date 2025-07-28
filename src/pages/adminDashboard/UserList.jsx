import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";
import { FaUsers } from "react-icons/fa";

const UsersList = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user) {
      setLoading(true);
      axiosSecure("/get-users")
        .then(({ data }) => {
          setUsers(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleRoleChange = (e, email) => {
    const role = e.target.value;

    axiosSecure
      .patch("/update-role", {
        role,
        email,
      })
      .then(({ data }) => {
        if (data.modifiedCount) {
          toast.success("User role updated successfully");
          setUsers((prevUsers) =>
            prevUsers.map((u) => (u.email === email ? { ...u, role } : u))
          );
        } else {
          toast.error("Failed to update role");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const handleStatus = (email, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    axiosSecure
      .patch("/update-status", { email, status: newStatus })
      .then(({ data }) => {
        if (data.modifiedCount) {
          toast.success(`User status updated to ${newStatus}`);
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.email === email ? { ...u, status: newStatus } : u
            )
          );
        } else {
          toast.error("Failed to update user status");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  // Filter users based on status
  const filteredUsers =
    filterStatus === "all"
      ? users
      : users.filter((user) => user.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage user roles and account status
              </p>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 hidden sm:block">
                Filter by:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              >
                <option value="all">All Users ({users.length})</option>
                <option value="active">
                  Active Users (
                  {users.filter((u) => u.status === "active").length})
                </option>
                <option value="blocked">
                  Blocked Users (
                  {users.filter((u) => u.status === "blocked").length})
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Cards View */}
        <div className="lg:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {user.role}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Change Role
                  </label>
                  <select
                    onChange={(e) => handleRoleChange(e, user.email)}
                    defaultValue={user.role}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="donor">Donor</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Change Status
                  </label>
                  <button
                    onClick={() => handleStatus(user.email, user.status)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      user.status === "active"
                        ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                    }`}
                  >
                    {user.status === "active" ? "Block User" : "Activate User"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Change Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        onChange={(e) => handleRoleChange(e, user.email)}
                        defaultValue={user.role}
                        className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="donor">Donor</option>
                        <option value="volunteer">Volunteer</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatus(user.email, user.status)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                          user.status === "active"
                            ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        }`}
                      >
                        {user.status === "active" ? "Block" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FaUsers className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600">
              No users match your current filter selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
