import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";

export default function DonationRequest() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!user) return;

    axiosSecure
      .get("/my-donation-request")
      .then(async (res) => {
        const donations = res.data;
        setDonations(donations);

        // Fetch donor info for each donation
        const donorData = {};
        await Promise.all(
          donations.map(async (donation) => {
            try {
              const donorRes = await axiosSecure.get(
                `/find-donor?donationId=${donation._id}`
              );
              if (donorRes.data.length > 0) {
                donorData[donation._id] = donorRes.data[0];
              }
            } catch (err) {
              console.error("Error fetching donor for donation:", donation._id);
            }
          })
        );
        setDonors(donorData);
      })
      .catch((err) => {
        console.error("Error fetching donation requests:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const filteredDonations =
    filterStatus === "all"
      ? donations
      : donations.filter((d) => d.donationStatus === filterStatus);

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        My Donation Requests
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {["all", "pending", "inprogress", "done", "canceled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded text-sm font-medium ${
              filterStatus === status
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-600">Loading your requests...</p>
      ) : filteredDonations.length === 0 ? (
        <p className="text-center text-gray-500">No donation requests found.</p>
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
                <th className="px-3 py-2">Donor Info</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((donation, i) => (
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
                    {donation.donationDate} <br />
                    <span className="text-gray-500 text-xs">
                      {donation.donationTime}
                    </span>
                  </td>
                  <td className="px-3 py-2">{donation.bloodGroup}</td>
                  <td className="px-3 py-2 capitalize">
                    {donation.donationStatus}
                  </td>
                  <td className="px-3 py-2">
                    {donors[donation._id] ? (
                      <>
                        <div className="font-medium">
                          {donors[donation._id].donorName}
                        </div>
                        <div className="text-xs text-gray-600">
                          {donors[donation._id].donorEmail}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 space-x-1">
                    <Link
                      to={`/details/${donation._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </Link>
                    <Link
                      to="#"
                      className="text-green-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      to="#"
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </Link>
                    {donation.donationStatus === "inprogress" && (
                      <>
                        <button className="text-green-700 hover:underline text-sm ml-2">
                          Done
                        </button>
                        <button className="text-yellow-700 hover:underline text-sm ml-1">
                          Cancel
                        </button>
                      </>
                    )}
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
