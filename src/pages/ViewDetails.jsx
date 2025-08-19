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

  if (!details)
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <p className="text-center">Loading donation details...</p>
      </div>
    );

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <PageTitle title={"Details"} />

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Donation Request Details</h2>
        <div
          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
            donationStatus === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : donationStatus === "inprogress"
              ? "bg-blue-100 text-blue-800"
              : donationStatus === "done"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          Status: {donationStatus.toUpperCase()}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-cardBg border-border border rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Requester Information */}
            <div>
              <h3 className="text-lg font-semibold text-highlighted mb-3">
                Requester Information
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {requesterName}
                </p>
                <p>
                  <strong>Email:</strong> {requesterEmail}
                </p>
              </div>
            </div>

            {/* Recipient Information */}
            <div>
              <h3 className="text-lg font-semibold text-highlighted mb-3">
                Recipient Information
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {recipientName}
                </p>
                <p>
                  <strong>Location:</strong> {recipientUpazila},{" "}
                  {recipientDistrict}
                </p>
                <p>
                  <strong>Hospital:</strong> {hospitalName}
                </p>
                <p>
                  <strong>Address:</strong> {fullAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Donation Details */}
            <div>
              <h3 className="text-lg font-semibold text-highlighted mb-3">
                Donation Details
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Blood Group:</strong>{" "}
                  <span className="text-highlighted font-bold">
                    {bloodGroup}
                  </span>
                </p>
                <p>
                  <strong>Date:</strong> {donationDate}
                </p>
                <p>
                  <strong>Time:</strong> {donationTime}
                </p>
              </div>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-lg font-semibold text-highlighted mb-3">
                Message
              </h3>
              <p className="bg-rose-50 p-4 rounded-lg border border-border">
                {requestMessage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center mt-8">
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
          className={`px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 cursor-pointer ${
            donationStatus === "inprogress" ||
            donationStatus === "done" ||
            donationStatus === "canceled"
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-cta text-btn-text hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
        >
          {donationStatus === "inprogress"
            ? "Donation in Progress"
            : donationStatus === "done"
            ? "Donation Completed"
            : donationStatus === "canceled"
            ? "Request Canceled"
            : "Confirm Donation"}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            <h3 className="text-2xl font-semibold text-highlighted mb-6 text-center">
              Confirm Donation
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Donor Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  readOnly
                  className="w-full border-border border rounded-lg px-4 py-3 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Donor Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full border-border border rounded-lg px-4 py-3 bg-gray-50"
                />
              </div>
            </div>

            <div className="bg-rose-50 border border-border rounded-lg p-4 mb-6">
              <p className="text-sm text-highlighted font-semibold">
                ⚠️ By confirming, you agree to donate blood and will be
                contacted for further details.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border border-border rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonation}
                className="px-6 py-3 bg-cta text-btn-text rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Confirm Donation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
