import Lottie from "lottie-react";
import { useContext, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { SlLocationPin } from "react-icons/sl";
import { GrLocationPin } from "react-icons/gr";

const Register = () => {
  const goTo = useNavigate();
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

  // Fetch districts
  const { data: districts = [], isLoading: isDistrictsLoading } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5001/districts");
      return data;
    },
  });

  // Fetch upazilas (filtered by districtId)
  const { data: upazilas = [], isLoading: isUpazilasLoading } = useQuery({
    queryKey: ["upazilas", formData.districtId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5001/upazilas?district_id=${formData.districtId}`
      );
      return data;
    },
    enabled: !!formData.districtId,
  });

  if (isDistrictsLoading || isUpazilasLoading) return <p>Loading...</p>;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle district selection (set both name and id)
  const handleDistrictChange = (e) => {
    const selectedName = e.target.value;
    const selectedDistrict = districts.find((d) => d.name === selectedName);
    setFormData((prev) => ({
      ...prev,
      district: selectedName,
      districtId: selectedDistrict ? selectedDistrict.id : "",
      upazila: "", // reset upazila when district changes
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
      // Create user with Firebase
      const res = await createUser(email, pass);
      await updateUser({ displayName: name, photoURL: image });

      // Save user data to MongoDB with default role = donor
      await axios.post("http://localhost:5001/add-user", {
        name,
        email,
        image,
        bloodGroup: blood,
        district, // district name
        upazila,
        role: "donor",
        status: "active",
        // loginCount: 1,
      });

      // Success popup
      Swal.fire("Success", "Registration completed successfully!", "success");

      // Set user in context
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
    <div className="bg-[url(/bg.png)] bg-contain">
      <div className="bg-white bg-opacity-90 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="title mt-5">
            <Title>Join with Us</Title>
          </div>

          <div className="flex justify-between items-center gap-5 pt-8 flex-col lg:flex-row">
            {/* Registration Form */}
            <div className="login-form flex-1 w-full max-w-lg">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-5 flex flex-col gap-6 backdrop-blur-sm bg-opacity-10 shadow-lg rounded-lg"
              >
                {/* Name */}
                <div className="flex items-center">
                  <BiUser className="text-3xl text-slate-500 mr-2" />
                  <input
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400 transition-all duration-200"
                    type="text"
                    name="name"
                    placeholder="Enter Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Image */}
                <div className="flex items-center">
                  <BiImageAdd className="text-3xl text-slate-500 mr-2" />
                  <input
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400 transition-all duration-200"
                    type="text"
                    name="image"
                    placeholder="Enter Image URL"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <BiEnvelope className="text-3xl text-slate-500 mr-2" />
                  <input
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400 transition-all duration-200"
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Blood Group */}
                <div className="flex items-center">
                  <BiDroplet className="text-3xl text-slate-500 mr-2" />
                  <select
                    name="blood"
                    value={formData.blood}
                    onChange={handleChange}
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400 transition-all duration-200"
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
                <div className="flex items-center">
                  <SlLocationPin className="text-2xl text-slate-500 mr-2" />
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400 transition-all duration-200"
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
                <div className="flex items-center">
                  <GrLocationPin className="text-3xl text-slate-500 mr-2" />
                  <select
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleChange}
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400 transition-all duration-200"
                    required
                  >
                    <option value="">Select Upazila</option>
                    {upazilas.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div className="flex items-center">
                  <BiKey className="text-3xl text-slate-500 mr-2" />
                  <input
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400 transition-all duration-200"
                    type="password"
                    name="pass"
                    placeholder="Enter Password"
                    value={formData.pass}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="flex items-center">
                  <BiKey className="text-3xl text-slate-500 mr-2" />
                  <input
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400 transition-all duration-200"
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
                  <p className="text-red-500 text-sm text-center">{errorMsg}</p>
                )}
                {/* Login link */}
                <div className="p-1 flex gap-2 text-sm text-slate-600">
                  <span>Have an account?</span>
                  <Link to="/login" className="text-red-500 hover:underline">
                    Login
                  </Link>
                </div>
                {/* Submit */}
                <button
                  type="submit"
                  className="btn cursor-pointer"
                  disabled={loadingSave}
                >
                  {loadingSave ? "Registering..." : "Register Now"}
                </button>
              </form>
            </div>

            {/* Animation */}
            <div className="lottie flex-1 flex mx-20">
              <Lottie animationData={happy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
