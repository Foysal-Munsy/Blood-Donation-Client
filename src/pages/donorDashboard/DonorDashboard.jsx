import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import WelcomeMsg from "../../components/WelcomeMsg";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/axiosPublic";
import PageTitle from "../../components/PageTitle";

export default function DonorDashboard({ user }) {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get("/my-donation-request")
        .then((res) => {
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
              setDonationRequests((prev) =>
                prev.filter((req) => req._id !== id)
              );
              Swal.fire(
                "Deleted!",
                "Your request has been deleted.",
                "success"
              );
            } else {
              Swal.fire(
                "Error",
                "Request not found or already deleted.",
                "error"
              );
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Error", "Something went wrong.", "error");
          });
      }
    });
  };

  return (
    <div className="p-4">
      <PageTitle title={"Donor Dashboard"} />
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
                    <Link
                      to={`/dashboard/update-donation-request/${item._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/details/${item._id}`}
                      className="text-indigo-600 hover:underline"
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
