import axios from "axios";
import React, { useEffect, useState } from "react";

export default function DonationRequest() {
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    axios
      .get("/districts.json")
      .then((res) => setDistricts(res.data))
      .catch((err) => console.error("Failed to load districts:", err));
  }, []);

  useEffect(() => {
    axios
      .get("/upazilas.json")
      .then((res) => setUpazilas(res.data))
      .catch((err) => console.error("Failed to load upazilas:", err));
  }, []);

  // Filter upazilas when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const filtered = upazilas.filter(
        (upazila) => upazila.district_id === selectedDistrict
      );
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrict, upazilas]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Donation Request Form</h2>

      <form className="space-y-4">
        {/* District Select */}
        <div>
          <label className="block mb-1 font-medium">Select District:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- Select District --</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        {/* Upazila Select */}
        {filteredUpazilas.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Select Upazila:</label>
            <select className="w-full border rounded px-3 py-2" required>
              <option value="">-- Select Upazila --</option>
              {filteredUpazilas.map((upazila) => (
                <option key={upazila.id} value={upazila.name}>
                  {upazila.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </form>
    </div>
  );
}
