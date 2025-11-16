import Lottie from "lottie-react";
import { useContext, useEffect, useState } from "react";
import {
  BiEnvelope,
  BiImageAdd,
  BiKey,
  BiUser,
  BiDroplet,
} from "react-icons/bi";
import { Link, useNavigate } from "react-router";
import happy from "../assets/happy.json";
import Title from "../components/Title";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import { SlLocationPin } from "react-icons/sl";
import { GrLocationPin } from "react-icons/gr";
import useAxiosPublic from "../hooks/axiosPublic";
import axios from "axios";
import PageTitle from "../components/PageTitle";

const Register = () => {
  const goTo = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { createUser, setUser, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    blood: "",
    district: "",
    districtId: "",
    upazila: "",
    pass: "",
    confirmPass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDistrictChange = (e) => {
    const selectedName = e.target.value;
    const selectedDistrict = districts.find((d) => d.name === selectedName);
    setFormData((prev) => ({
      ...prev,
      district: selectedName,
      districtId: selectedDistrict ? selectedDistrict.id : "",
      upazila: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, image, blood, district, upazila, pass, confirmPass } =
      formData;

    if (pass !== confirmPass) {
      setErrorMsg("Passwords do not match!");
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    setErrorMsg("");
    setLoadingSave(true);

    try {
      const res = await createUser(email, pass);
      await updateUser({ displayName: name, photoURL: image });

      await axiosPublic.post("/add-user", {
        name,
        email,
        image,
        bloodGroup: blood,
        district,
        upazila,
        role: "donor",
        status: "active",
      });

      Swal.fire("Success", "Registration completed successfully!", "success");

      setUser({
        ...res.user,
        displayName: name,
        photoURL: image,
        bloodGroup: blood,
        district,
        upazila,
        role: "donor",
        status: "active",
      });

      goTo(location.state ? location.state : "/");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Registration failed. Try again.", "error");
      setErrorMsg("Registration failed. Try again.");
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-12 sm:py-20">
      <PageTitle title={"Register"} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-rose-600 to-red-600 dark:from-rose-400 dark:to-red-400 bg-clip-text text-transparent mb-2">
            Join Our Community
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-sm sm:text-base">
            Register to become a lifesaver today
          </p>
        </div>

        <div className="flex justify-between items-start gap-8 lg:gap-12 flex-col lg:flex-row">
          {/* Form */}
          <div className="flex-1 w-full max-w-lg">
            <form
              onSubmit={handleSubmit}
              className="glass p-6 sm:p-8 flex flex-col gap-5 sm:gap-6 shadow-2xl rounded-2xl border border-rose-200 dark:border-slate-700"
            >
                {/* Name */}
                <div className="flex items-center gap-2">
                  <BiUser className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                  <input
                    className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted border-border text-text text-sm sm:text-base"
                    type="text"
                    name="name"
                    placeholder="Enter Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Image */}
                <div className="flex items-center gap-2">
                  <BiImageAdd className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                  <input
                    className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted border-border text-text text-sm sm:text-base"
                    type="text"
                    name="image"
                    placeholder="Enter Image URL"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                  <BiEnvelope className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                  <input
                    className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted border-border text-text text-sm sm:text-base"
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Blood Group */}
                <div className="flex items-center gap-2">
                  <BiDroplet className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                  <select
                    name="blood"
                    value={formData.blood}
                    onChange={handleChange}
                    className="outline-none flex-1 border-b p-2 bg-white dark:bg-slate-800 focus:border-highlighted border-border text-text text-sm sm:text-base"
                    required
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
                </div>

                {/* District */}
                <div className="flex items-center gap-2">
                  <SlLocationPin className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    className="outline-none flex-1 border-b p-2 bg-white dark:bg-slate-800 focus:border-highlighted border-border text-text text-sm sm:text-base"
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upazila */}
                <div className="flex items-center gap-2">
                  <GrLocationPin className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                  <select
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleChange}
                    className="outline-none flex-1 border-b p-2 bg-white dark:bg-slate-800 focus:border-highlighted border-border text-text text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Upazila</option>
                    {filteredUpazilas.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div className="flex items-center gap-2">
                  <BiKey className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                  <input
                    className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted border-border text-text text-sm sm:text-base"
                    type="password"
                    name="pass"
                    placeholder="Enter Password"
                    value={formData.pass}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="flex items-center gap-2">
                  <BiKey className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                  <input
                    className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted border-border text-text text-sm sm:text-base"
                    type="password"
                    name="confirmPass"
                    placeholder="Confirm Password"
                    value={formData.confirmPass}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Error */}
                {errorMsg && (
                  <p className="text-highlighted text-xs sm:text-sm text-center font-medium">
                    {errorMsg}
                  </p>
                )}

                {/* Login link */}
                <div className="p-1 flex gap-2 text-xs sm:text-sm text-text opacity-80">
                  <span>Have an account?</span>
                  <Link
                    to="/login"
                    className="text-highlighted hover:underline font-medium"
                  >
                    Login
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-2.5 sm:py-3 rounded-lg bg-cta text-btn-text font-semibold text-sm sm:text-base hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loadingSave}
                >
                  {loadingSave ? "Registering..." : "Register Now"}
                </button>
            </form>
          </div>

          {/* Lottie Animation */}
          <div className="lottie flex-1 w-full max-w-md lg:max-w-lg mx-auto">
            <Lottie animationData={happy} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
