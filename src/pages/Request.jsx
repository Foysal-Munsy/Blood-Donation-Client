import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosPublic from "../hooks/axiosPublic";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";

export default function Request() {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosPublic
      .get("/all-donation-requests-public")
      .then((res) => setDonations(res.data))
      .catch((err) => {
        console.error("Error fetching donation requests:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageTitle title={"Request"} />
      <h2 className="text-2xl font-semibold mb-4 text-center text-text">
        Pending Blood Donation Requests
      </h2>

      {loading ? (
        <Loader label="Loading pending requests..." />
      ) : donations.length === 0 ? (
        <p className="text-center">No pending donation requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-lg overflow-hidden text-sm bg-white dark:bg-slate-800">
            <thead className="bg-cardBg text-highlighted dark:bg-slate-700">
              <tr>
                <th className="px-3 py-2">Recipient</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Date & Time</th>
                <th className="px-3 py-2">Blood Group</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center text-text">
              {donations.map((donation, i) => (
                <tr
                  key={donation._id}
                  className={
                    i % 2 === 0
                      ? "border border-border dark:bg-slate-800"
                      : "border border-border dark:bg-slate-700/50"
                  }
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
                    <span className="text-xs opacity-75">
                      {donation.donationTime}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-semibold text-highlighted">
                    {donation.bloodGroup}
                  </td>
                  <td className="px-3 py-2 capitalize">
                    {donation.donationStatus}
                  </td>

                  <td className="px-3 py-2">
                    <Link
                      to={`/details/${donation._id}`}
                      className="text-highlighted hover:underline text-sm font-medium"
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
