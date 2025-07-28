import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";

const UsersList = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user)
      axiosSecure("/get-users")
        .then(({ data }) => setUsers(data))
        .catch((err) => console.error("Error fetching users:", err));
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
        }
        console.log(data);
      })
      .catch(() => {
        toast.error("Failed to update role");
      });
  };

  const handleStatus = (email, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    axiosSecure
      .patch("/update-status", {
        email,
        status: newStatus,
      })
      .then(({ data }) => {
        if (data.modifiedCount) {
          toast.success(`User status updated to ${newStatus}`);
          // Update the local state without re-fetch
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

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
        All Users
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded-md text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Avatar</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Change Role</th>
              <th className="p-2">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2 capitalize">{user.role}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-2">
                  <select
                    onChange={(e) => handleRoleChange(e, user.email)}
                    defaultValue={user.role}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-400"
                  >
                    <option value="admin">Admin</option>
                    <option value="donor">Donor</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleStatus(user.email, user.status)}
                    className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                      user.status === "active"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
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
  );
};

export default UsersList;
