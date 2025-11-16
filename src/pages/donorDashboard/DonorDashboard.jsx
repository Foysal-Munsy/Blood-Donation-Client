import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
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
    <div className="p-4 sm:p-6 lg:p-8">
      <PageTitle title={"Donor Dashboard"} />
      {/* Welcome Message */}
      <WelcomeMsg />

      {/* Donation Requests Table */}
      {loading && <Loader label="Loading your latest requests..." />}
      {!loading && donationRequests.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-rose-200 mt-8">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-rose-50 to-red-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Recipient
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Blood
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {donationRequests.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-rose-100 hover:bg-rose-50 transition-colors text-text"
                  >
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
        </div>
      )}

      {/* No requests */}
      {!loading && donationRequests.length === 0 && (
        <div className="glass p-12 rounded-2xl text-center mt-8">
          <div className="text-6xl mb-4">🩸</div>
          <p className="text-text text-lg">
            You have not created any donation requests yet.
          </p>
        </div>
      )}

      {/* View All Requests Button */}
      {!loading && donationRequests.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            to="/dashboard/my-donation-requests"
            className="inline-block px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            View All My Requests
          </Link>
        </div>
      )}
    </div>
  );
}
