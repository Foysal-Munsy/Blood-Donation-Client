import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import WelcomeMsg from "../../components/WelcomeMsg";

export default function DonorDashboard({ user }) {
  const axiosSecure = useAxiosSecure();
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get("/my-donation-request")
        .then((res) => {
          // Show only 3 most recent requests
          const sorted = res.data
            .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
            .slice(0, 3);
          setDonationRequests(sorted);
        })
        .catch((err) => {
          console.error("Error fetching donation requests:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="p-4">
      {/* Welcome Message */}
      <WelcomeMsg />
      {/* Donation Requests Table */}
      {!loading && donationRequests.length > 0 && (
        <div className="overflow-x-auto shadow rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Recipient</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Blood</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donationRequests.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.recipientName}</td>
                  <td className="px-4 py-2">
                    {item.recipientDistrict}, {item.recipientUpazila}
                  </td>
                  <td className="px-4 py-2">{item.donationDate}</td>
                  <td className="px-4 py-2">{item.donationTime}</td>
                  <td className="px-4 py-2 font-semibold text-red-600">
                    {item.bloodGroup}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {item.donationStatus}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {/* Show Done/Cancel only if status is inprogress */}
                    {item.donationStatus === "inprogress" && (
                      <>
                        <button className="text-green-600 hover:underline">
                          Done
                        </button>
                        <button className="text-red-600 hover:underline">
                          Cancel
                        </button>
                      </>
                    )}
                    {/* Common Action Buttons */}
                    <Link to={""} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <Link to={""} className="text-red-500 hover:underline">
                      Delete
                    </Link>
                    <Link to={""} className="text-indigo-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* No requests */}
      {!loading && donationRequests.length === 0 && (
        <p className="text-gray-500 text-center mt-6">
          You have not created any donation requests yet.
        </p>
      )}
      {/* View All Requests Button */}
      {!loading && donationRequests.length > 0 && (
        <div className="mt-6 text-center">
          <Link
            to="/dashboard/my-donation-requests"
            className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition"
          >
            View My All Requests
          </Link>
        </div>
      )}
    </div>
  );
}
