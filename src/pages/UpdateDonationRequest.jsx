import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

export default function UpdateDonationRequest() {
  const { ID } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/get-donation-request/${ID}`).then((res) => {
      setDetails(res.data);
    });
  }, [ID]);

  if (!details) return <Loader label="Loading request..." full={true} />;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedRequest = {
      requesterName: form.requesterName.value,
      requesterEmail: details.requesterEmail, // keep email from original data
      recipientName: form.recipientName.value,
      recipientDistrict: form.recipientDistrict.value,
      recipientUpazila: form.recipientUpazila.value,
      hospitalName: form.hospitalName.value,
      fullAddress: form.fullAddress.value,
      bloodGroup: form.bloodGroup.value,
      donationDate: form.donationDate.value,
      donationTime: form.donationTime.value,
      requestMessage: form.requestMessage.value,
      donationStatus: details.donationStatus, // preserve status
    };

    try {
      const res = await axiosSecure.put(
        `/update-donation-request/${ID}`,
        updatedRequest
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire("Success!", "Request updated successfully.", "success");
        navigate("/dashboard/my-donation-requests");
      } else {
        Swal.fire("Info", "No changes made.", "info");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update request.", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Update Donation Request
      </h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-medium">Requester Name</label>
          <input
            type="text"
            name="requesterName"
            defaultValue={details.requesterName}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Requester Email</label>
          <input
            type="email"
            name="requesterEmail"
            defaultValue={details.requesterEmail}
            className="w-full border border-gray-300 p-2 rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            defaultValue={details.recipientName}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">District</label>
            <input
              type="text"
              name="recipientDistrict"
              defaultValue={details.recipientDistrict}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Upazila</label>
            <input
              type="text"
              name="recipientUpazila"
              defaultValue={details.recipientUpazila}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            defaultValue={details.hospitalName}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Full Address</label>
          <textarea
            name="fullAddress"
            defaultValue={details.fullAddress}
            className="w-full border border-gray-300 p-2 rounded"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              defaultValue={details.bloodGroup}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Status</label>
            <input
              type="text"
              name="donationStatus"
              defaultValue={details.donationStatus}
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
              name="donationDate"
              defaultValue={details.donationDate}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Time</label>
            <input
              type="time"
              name="donationTime"
              defaultValue={details.donationTime}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Request Message</label>
          <textarea
            name="requestMessage"
            defaultValue={details.requestMessage}
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
