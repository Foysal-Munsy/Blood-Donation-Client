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
    <div className="bg-[url(/bg.png)] bg-contain">
      <PageTitle title={"Register"} />
      <div className="bg-white bg-opacity-90 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="title mt-5">
            <Title>Join with Us</Title>
          </div>

          <div className="flex justify-between items-center gap-5 pt-8 flex-col lg:flex-row">
            {/* Form */}
            <div className="login-form flex-1 w-full max-w-lg">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-5 flex flex-col gap-6 backdrop-blur-sm bg-opacity-10 shadow-lg rounded-lg"
              >
                {/* Name */}
                <div className="flex items-center">
                  <BiUser className="text-3xl text-slate-500 mr-2" />
                  <input
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400"
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
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400"
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
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400"
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
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400"
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
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400"
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
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400"
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
                <div className="flex items-center">
                  <BiKey className="text-3xl text-slate-500 mr-2" />
                  <input
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400"
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
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400"
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

            {/* Lottie Animation */}
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
