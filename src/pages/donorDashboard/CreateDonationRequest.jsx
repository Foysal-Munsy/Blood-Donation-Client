import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import useAxiosPublic from "../../hooks/axiosPublic";
import useStatus from "../../hooks/useStatus";
import PageTitle from "../../components/PageTitle";

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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageTitle title={"Create Donation Request"} />
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
        Create Donation Request
      </h2>
      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6">
        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Requester Name
          </label>
          <input
            type="text"
            name="requesterName"
            value={formData.requesterName}
            readOnly
            className="w-full border-2 border-rose-200 p-3 rounded-lg bg-slate-50"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Requester Email
          </label>
          <input
            type="email"
            name="requesterEmail"
            value={formData.requesterEmail}
            readOnly
            className="w-full border-2 border-rose-200 p-3 rounded-lg bg-slate-50"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Recipient Name
          </label>
          <input
            type="text"
            name="recipientName"
            placeholder="Recipient Name"
            value={formData.recipientName}
            onChange={handleChange}
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-700">
              District
            </label>
            <select
              name="recipientDistrict"
              value={formData.recipientDistrict}
              onChange={handleChange}
              className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
              required
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2 text-slate-700">
              Upazila
            </label>
            <select
              name="recipientUpazila"
              value={formData.recipientUpazila}
              onChange={handleChange}
              className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
              required
            >
              <option value="">Select Upazila</option>
              {filteredUpazilas.map((upazila) => (
                <option key={upazila.id} value={upazila.name}>
                  {upazila.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Hospital Name
          </label>
          <input
            type="text"
            name="hospitalName"
            placeholder="Hospital Name"
            value={formData.hospitalName}
            onChange={handleChange}
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Full Address
          </label>
          <input
            type="text"
            name="fullAddress"
            placeholder="Full Address"
            value={formData.fullAddress}
            onChange={handleChange}
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-700">
              Donation Date
            </label>
            <input
              type="date"
              name="donationDate"
              value={formData.donationDate}
              onChange={handleChange}
              className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-slate-700">
              Donation Time
            </label>
            <input
              type="time"
              name="donationTime"
              value={formData.donationTime}
              onChange={handleChange}
              className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-slate-700">
            Request Message
          </label>
          <textarea
            name="requestMessage"
            placeholder="Why do you need blood?"
            value={formData.requestMessage}
            onChange={handleChange}
            className="w-full border-2 border-rose-200 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 transition-all"
            rows="4"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
