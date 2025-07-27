import Lottie from "lottie-react";
import { useContext, useState } from "react";
import {
  BiEnvelope,
  BiImageAdd,
  BiKey,
  BiUser,
  BiDroplet,
} from "react-icons/bi";
import { useNavigate } from "react-router";
import happy from "../assets/happy.json";
import Title from "../components/Title";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Register = () => {
  const goTo = useNavigate();
  const { createUser, setUser, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    blood: "",
    district: "",
    upazila: "",
    pass: "",
    confirmPass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch districts
  const { data: districts = [], isLoading: isDistrictsLoading } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5001/districts");
      return data;
    },
  });

  // Fetch upazillas (filtered by selected district)
  const { data: upazillas = [], isLoading: isUpazillasLoading } = useQuery({
    queryKey: ["upazillas", formData.district],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5001/upazillas?district_id=${formData.district}`
      );
      return data;
    },
    enabled: !!formData.district,
  });

  if (isDistrictsLoading || isUpazillasLoading) return <p>Loading...</p>;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, image, blood, district, upazila, pass, confirmPass } =
      formData;

    if (pass !== confirmPass) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    // Create user with Firebase
    createUser(email, pass)
      .then((res) => {
        updateUser({ displayName: name, photoURL: image }).then(() => {
          setUser({
            ...res.user,
            displayName: name,
            photoURL: image,
            bloodGroup: blood,
            district,
            upazila,
          });
          goTo(`${location.state ? location.state : "/"}`);
        });
      })
      .catch(() => {
        setErrorMsg("Registration failed. Try again.");
      });
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
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400 transition-all duration-200"
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

                {/* Upazila */}
                <div className="flex items-center">
                  <select
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleChange}
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-red-400 transition-all duration-200"
                    required
                  >
                    <option value="">Select Upazila</option>
                    {upazillas.map((u) => (
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

                {/* Submit */}
                <input
                  type="submit"
                  value="Register Now"
                  className="btn cursor-pointer"
                />
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
