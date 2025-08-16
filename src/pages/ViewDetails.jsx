import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/axiosPublic";
import PageTitle from "../components/PageTitle";

export default function ViewDetails() {
  const { ID } = useParams();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [details, setDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axiosSecure.get(`/details/${ID}`).then((res) => {
      setDetails(res.data);
    });
  }, [ID]);

  if (!details) return <p className="text-center mt-10">Loading...</p>;

  const {
    requesterName,
    requesterEmail,
    recipientName,
    recipientDistrict,
    recipientUpazila,
    hospitalName,
    fullAddress,
    bloodGroup,
    donationDate,
    donationTime,
    requestMessage,
    donationStatus,
  } = details;

  const handleConfirmDonation = async () => {
    try {
      // Step 1: Update donation status
      const res = await axiosSecure.patch("/donation-status", {
        id: details._id,
        donationStatus: "inprogress",
      });

      if (res.data.modifiedCount > 0) {
        // Step 2: Save donor info
        const donorInfo = {
          donorName: user?.displayName,
          donorEmail: user?.email,
          donationId: details._id,
          createdAt: new Date(),
        };

        const donorRes = await axiosPublic.post("/add-donor", donorInfo);

        if (donorRes.data.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Donation In Progress!",
            text: `Thank you ${user?.displayName} for your generosity.`,
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Donor Not Saved",
            text: "Donation status updated, but donor info wasn't saved.",
          });
        }

        setDetails({ ...details, donationStatus: "inprogress" });
        setShowModal(false);
      } else {
        Swal.fire({
          icon: "warning",
          title: "No changes made",
          text: "Donation status was not updated. It may already be in progress.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while confirming the donation.",
      });
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <PageTitle title={"Details"} />
      <h2 className="text-2xl font-semibold text-center mb-6">
        Donation Request Details
      </h2>

      <div className="space-y-2">
        <p>
          <strong>Requester Name:</strong> {requesterName}
        </p>
        <p>
          <strong>Requester Email:</strong> {requesterEmail}
        </p>
        <p>
          <strong>Recipient Name:</strong> {recipientName}
        </p>
        <p>
          <strong>District:</strong> {recipientDistrict}
        </p>
        <p>
          <strong>Upazila:</strong> {recipientUpazila}
        </p>
        <p>
          <strong>Hospital Name:</strong> {hospitalName}
        </p>
        <p>
          <strong>Address:</strong> {fullAddress}
        </p>
        <p>
          <strong>Blood Group:</strong> {bloodGroup}
        </p>
        <p>
          <strong>Donation Date:</strong> {donationDate}
        </p>
        <p>
          <strong>Donation Time:</strong> {donationTime}
        </p>
        <p>
          <strong>Message:</strong> {requestMessage}
        </p>
        <p>
          <strong>Status:</strong> {donationStatus}
        </p>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => {
            if (
              donationStatus !== "inprogress" &&
              donationStatus !== "done" &&
              donationStatus !== "canceled"
            ) {
              setShowModal(true);
            }
          }}
          disabled={
            donationStatus === "inprogress" ||
            donationStatus === "done" ||
            donationStatus === "canceled"
          }
          className={`px-6 py-2 rounded transition ${
            donationStatus === "inprogress" ||
            donationStatus === "done" ||
            donationStatus === "canceled"
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          Donate
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
            <h3 className="text-xl font-semibold mb-4">Confirm Donation</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Donor Name</label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  readOnly
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Donor Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonation}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
