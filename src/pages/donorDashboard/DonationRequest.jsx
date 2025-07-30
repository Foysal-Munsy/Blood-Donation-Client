import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/axiosPublic";

export default function DonationRequest() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .delete(`/delete-request/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setDonations((prev) =>
                prev.filter((donation) => donation._id !== id)
              );
              Swal.fire(
                "Deleted!",
                "Your request has been deleted.",
                "success"
              );
            } else {
              Swal.fire("Error", "Deletion failed. Please try again.", "error");
            }
          })
          .catch(() => {
            Swal.fire("Error", "Something went wrong.", "error");
          });
      }
    });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    Swal.fire({
      title: `Change status to "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const res = await axiosSecure.patch("/donation-status", {
          id,
          donationStatus: newStatus,
        });

        if (res.data.modifiedCount > 0) {
          setDonations((prev) =>
            prev.map((donation) =>
              donation._id === id
                ? { ...donation, donationStatus: newStatus }
                : donation
            )
          );
          Swal.fire("Success!", `Status updated to "${newStatus}".`, "success");
        } else {
          Swal.fire("Failed", "Status update failed. Try again.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong.", "error");
      }
    });
  };

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
                    <button
                      onClick={() => handleDelete(donation._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>

                    {donation.donationStatus === "inprogress" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(donation._id, "done")
                          }
                          className="text-green-700 hover:underline text-sm ml-2"
                        >
                          Done
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(donation._id, "canceled")
                          }
                          className="text-yellow-700 hover:underline text-sm ml-1"
                        >
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
