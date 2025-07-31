import { useEffect, useState } from "react";
import axios from "axios";
import useAxiosPublic from "../hooks/axiosPublic";

export default function Search() {
  const axiosPublic = useAxiosPublic();
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);

  const [formData, setFormData] = useState({
    bloodGroup: "",
    districtId: "",
    upazilaId: "",
  });

  // Load districts and upazilas
  useEffect(() => {
    axios.get("/districts.json").then((res) => setDistricts(res.data));
    axios.get("/upazilas.json").then((res) => setUpazilas(res.data));
  }, []);

  // Filter upazilas based on selected district
  useEffect(() => {
    if (formData.districtId) {
      const filtered = upazilas.filter(
        (upa) => upa.district_id === formData.districtId
      );
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
    setFormData((prev) => ({ ...prev, upazilaId: "" }));
  }, [formData.districtId, upazilas]);

  const handleSearch = async (e) => {
    e.preventDefault();

    // If all fields are empty, skip search
    const { bloodGroup, districtId, upazilaId } = formData;
    if (!bloodGroup && !districtId && !upazilaId) {
      setDonors([]);
      return;
    }

    try {
      const res = await axiosPublic.get("/all-donation-requests-public");
      const data = res.data?.data || res.data || [];

      const filtered = data.filter((donor) => {
        return (
          (bloodGroup === "" || donor.bloodGroup === bloodGroup) &&
          (districtId === "" || donor.districtId === districtId) &&
          (upazilaId === "" || donor.upazilaId === upazilaId)
        );
      });

      setDonors(filtered);
    } catch (error) {
      console.error("Search error:", error);
      setDonors([]);
    }
  };
  console.log(donors);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Search for Blood Donors</h2>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {/* Blood Group */}
        <select
          className="border p-2 rounded"
          value={formData.bloodGroup}
          onChange={(e) =>
            setFormData({ ...formData, bloodGroup: e.target.value })
          }
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        {/* District */}
        <select
          className="border p-2 rounded"
          value={formData.districtId}
          onChange={(e) =>
            setFormData({ ...formData, districtId: e.target.value })
          }
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Upazila */}
        <select
          className="border p-2 rounded"
          value={formData.upazilaId}
          onChange={(e) =>
            setFormData({ ...formData, upazilaId: e.target.value })
          }
          disabled={!filteredUpazilas.length}
        >
          <option value="">Select Upazila</option>
          {filteredUpazilas.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="md:col-span-3 bg-red-600 text-white rounded p-2 hover:bg-red-700"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {donors.length > 0 ? (
        <div>
          <h3 className="text-lg font-medium mb-2">Matching Donors:</h3>
          <ul className="space-y-2">
            {donors.map((donor) => (
              <li
                key={donor._id}
                className="border p-3 rounded shadow flex flex-col md:flex-row justify-between"
              >
                <div>
                  <p>
                    <strong>Name:</strong> {donor.requesterName}
                  </p>
                  <p>
                    <strong>Blood:</strong> {donor.bloodGroup}
                  </p>
                  <p>
                    <strong>District:</strong>{" "}
                    {districts.find((d) => d.id === donor.districtId)?.name}
                  </p>
                  <p>
                    <strong>Upazila:</strong>{" "}
                    {upazilas.find((u) => u.id === donor.upazilaId)?.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">No donors found.</p>
      )}
    </div>
  );
}
