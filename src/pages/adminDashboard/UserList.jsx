import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const UsersList = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  console.log("🚀 ~ UsersList ~ s:", users);

  useEffect(() => {
    axiosSecure("/get-users")
      .then(({ data }) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-rose-700">All Users</h2>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-rose-600 text-white">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="border-b hover:bg-rose-50 transition duration-200"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{user.name || "N/A"}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
