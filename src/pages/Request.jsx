import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function Request() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    axiosSecure
      .get("/all-donation-requests")
      .then((res) => setDonations(res.data))
      .catch((err) => {
        console.error("Error fetching donation requests:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const pendingDonations = donations.filter(
    (d) => d.donationStatus === "pending"
  );

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Pending Blood Donation Requests
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading pending requests...</p>
      ) : pendingDonations.length === 0 ? (
        <p className="text-center text-gray-500">
          No pending donation requests found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-3 py-2">Recipient</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Date & Time</th>
                <th className="px-3 py-2">Blood Group</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDonations.map((donation, i) => (
                <tr
                  key={donation._id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-2 font-medium">
                    {donation.recipientName}
                  </td>
                  <td className="px-3 py-2">
                    {donation.recipientDistrict}, {donation.recipientUpazila}
                  </td>
                  <td className="px-3 py-2">
                    {donation.donationDate}
                    <br />
                    <span className="text-gray-500 text-xs">
                      {donation.donationTime}
                    </span>
                  </td>
                  <td className="px-3 py-2">{donation.bloodGroup}</td>
                  <td className="px-3 py-2 capitalize">
                    {donation.donationStatus}
                  </td>

                  <td className="px-3 py-2">
                    <Link
                      to={`/requests/${donation._id}`} // or your route path
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
