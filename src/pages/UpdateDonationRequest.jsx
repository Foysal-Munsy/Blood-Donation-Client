import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function UpdateDonationRequest() {
  const { ID } = useParams();
  const axiosSecure = useAxiosSecure();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/get-donation-request/${ID}`).then((res) => {
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Update Donation Request
      </h2>
      <form className="space-y-4">
        <div>
          <label className="block font-medium">Requester Name</label>
          <input
            type="text"
            defaultValue={requesterName}
            className="w-full border border-gray-300 p-2 rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium">Requester Email</label>
          <input
            type="email"
            defaultValue={requesterEmail}
            className="w-full border border-gray-300 p-2 rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium">Recipient Name</label>
          <input
            type="text"
            defaultValue={recipientName}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">District</label>
            <input
              type="text"
              defaultValue={recipientDistrict}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Upazila</label>
            <input
              type="text"
              defaultValue={recipientUpazila}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Hospital Name</label>
          <input
            type="text"
            defaultValue={hospitalName}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Full Address</label>
          <textarea
            defaultValue={fullAddress}
            className="w-full border border-gray-300 p-2 rounded"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Blood Group</label>
            <input
              type="text"
              defaultValue={bloodGroup}
              className="w-full border border-gray-300 p-2 rounded"
              readOnly
            />
          </div>
          <div>
            <label className="block font-medium">Status</label>
            <input
              type="text"
              defaultValue={donationStatus}
              className="w-full border border-gray-300 p-2 rounded"
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              defaultValue={donationDate}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Time</label>
            <input
              type="time"
              defaultValue={donationTime}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Request Message</label>
          <textarea
            defaultValue={requestMessage}
            className="w-full border border-gray-300 p-2 rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold"
        >
          Update
        </button>
      </form>
    </div>
  );
}
