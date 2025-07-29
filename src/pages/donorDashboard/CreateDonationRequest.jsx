import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import useAxiosPublic from "../../hooks/axiosPublic";
import useStatus from "../../hooks/useStatus";

const CreateDonationRequest = () => {
  const axiosPublic = useAxiosPublic();
  const { status, loading } = useStatus();

  console.log("🚀 ~ CreateDonationRequest ~ status:", status);

  const { user } = useContext(AuthContext);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const [formData, setFormData] = useState({
    requesterName: "",
    requesterEmail: "",
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        requesterName: user.displayName || "",
        requesterEmail: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch(() => toast.error("Failed to load districts"));
  }, []);

  useEffect(() => {
    fetch("/upazilas.json")
      .then((res) => res.json())
      .then((data) => setUpazilas(data))
      .catch(() => toast.error("Failed to load upazilas"));
  }, []);

  useEffect(() => {
    if (formData.recipientDistrict) {
      const filtered = upazilas.filter(
        (u) => u.district_id === formData.recipientDistrict
      );
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  }, [formData.recipientDistrict, upazilas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      toast.loading("Checking user status, please wait...");
      return;
    }
    if (status === "blocked") {
      toast.error(
        "Your request cannot be processed as your account is blocked. Please contact the administrator."
      );
      return;
    }
    // const dataToSubmit = {
    //   ...formData,
    //   donationStatus: "pending",
    // };
    const selectedDistrict = districts.find(
      (d) => d.id === formData.recipientDistrict
    );

    const dataToSubmit = {
      ...formData,
      recipientDistrict: selectedDistrict?.name || "",
      donationStatus: "pending",
    };

    try {
      const response = await axiosPublic.post(
        "/create-donation-request",
        dataToSubmit
      );
      toast.success("Donation request submitted successfully!");
      console.log("Donation request submitted:", response.data);
      // Optional: reset form here if you want
    } catch (error) {
      toast.error("Failed to submit donation request");
      console.error("Error submitting donation request:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl">Create Donation Request</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-4 bg-white rounded shadow space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Donation Request</h2>

        <input
          type="text"
          name="requesterName"
          value={formData.requesterName}
          readOnly
          className="input"
        />
        <input
          type="email"
          name="requesterEmail"
          value={formData.requesterEmail}
          readOnly
          className="input"
        />

        <input
          type="text"
          name="recipientName"
          placeholder="Recipient Name"
          value={formData.recipientName}
          onChange={handleChange}
          className="input"
          required
        />

        <select
          name="recipientDistrict"
          value={formData.recipientDistrict}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>

        <select
          name="recipientUpazila"
          value={formData.recipientUpazila}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select Upazila</option>
          {filteredUpazilas.map((upazila) => (
            <option key={upazila.id} value={upazila.name}>
              {upazila.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="hospitalName"
          placeholder="Hospital Name"
          value={formData.hospitalName}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          type="text"
          name="fullAddress"
          placeholder="Full Address"
          value={formData.fullAddress}
          onChange={handleChange}
          className="input"
          required
        />

        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select Blood Group</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
        </select>

        <input
          type="date"
          name="donationDate"
          value={formData.donationDate}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          type="time"
          name="donationTime"
          value={formData.donationTime}
          onChange={handleChange}
          className="input"
          required
        />

        <textarea
          name="requestMessage"
          placeholder="Why do you need blood?"
          value={formData.requestMessage}
          onChange={handleChange}
          className="input"
          rows="4"
          required
        ></textarea>

        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Request
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
