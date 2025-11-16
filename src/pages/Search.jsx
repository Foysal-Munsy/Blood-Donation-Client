import { useEffect, useState } from "react";
import axios from "axios";
import useAxiosPublic from "../hooks/axiosPublic";
import PageTitle from "../components/PageTitle";

const Search = () => {
  const axiosPublic = useAxiosPublic();
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  const [formData, setFormData] = useState({
    bloodGroup: "",
    district: "",
    districtId: "",
    upazila: "",
  });

  // Load districts and upazilas
  useEffect(() => {
    const fetchData = async () => {
      const [districtRes, upazilaRes] = await Promise.all([
        axios.get("/districts.json"),
        axios.get("/upazilas.json"),
      ]);
      setDistricts(districtRes.data);
      setUpazilas(upazilaRes.data);
    };
    fetchData();
  }, []);

  // Update filtered upazilas based on district selection
  useEffect(() => {
    if (formData.districtId) {
      const filtered = upazilas.filter(
        (u) => u.district_id === formData.districtId
      );
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  }, [formData.districtId, upazilas]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When district changes, update both name & id
    if (name === "district") {
      const selectedDistrict = districts.find((d) => d.name === value);
      setFormData((prev) => ({
        ...prev,
        district: value,
        districtId: selectedDistrict ? selectedDistrict.id : "",
        upazila: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosPublic.get("/get-donors");
      const allDonors = res.data;
      setDonors(allDonors);

      // Filter based on formData
      const filtered = allDonors.filter((donor) => {
        return (
          donor.role === "donor" &&
          donor.status === "active" &&
          (formData.bloodGroup
            ? donor.bloodGroup === formData.bloodGroup
            : true) &&
          (formData.district ? donor.district === formData.district : true) &&
          (formData.upazila ? donor.upazila === formData.upazila : true)
        );
      });

      setSearchResult(filtered);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="min-h-screen container  mx-auto px-4 sm:px-6 lg:px-8">
      <PageTitle title={"Search"} />
      <h2 className="text-2xl font-bold text-center mb-6 text-text">
        Find a Blood Donor
      </h2>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-cardBg p-6 rounded-lg shadow"
      >
        {/* Blood Group */}
        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          className="border-border border rounded px-3 py-2 bg-white dark:bg-slate-800 text-text"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        {/* District */}
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          className="border-border border rounded px-3 py-2 bg-white dark:bg-slate-800 text-text"
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.id} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>

        {/* Upazila */}
        <select
          name="upazila"
          value={formData.upazila}
          onChange={handleChange}
          className="border-border border rounded px-3 py-2 bg-white dark:bg-slate-800 text-text"
          disabled={!filteredUpazilas.length}
        >
          <option value="">Select Upazila</option>
          {filteredUpazilas.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-cta text-btn-text rounded px-4 py-2 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Search
        </button>
      </form>

      {/* Search Result */}
      {searchResult.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResult.map((donor) => (
            <div
              key={donor._id}
              className="border-border border rounded-lg shadow p-4 bg-cardBg text-center"
            >
              <img
                src={donor.image}
                alt={donor.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-2 border-2 border-border"
              />
              <h3 className="font-semibold text-lg text-text">{donor.name}</h3>
              <p className="text-sm text-highlighted">{donor.bloodGroup}</p>
              <p className="text-sm text-text">
                {donor.upazila}, {donor.district}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">{donor.email}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-text">
          {donors.length > 0
            ? "No donor found!"
            : "Please search to find donors."}
        </p>
      )}
    </div>
  );
};

export default Search;
