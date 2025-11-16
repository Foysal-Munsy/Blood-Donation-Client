import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useCurrentUser from "../../hooks/useCurrentUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { getAuth, updateProfile } from "firebase/auth";
import PageTitle from "../../components/PageTitle";
import Loader from "../../components/Loader";

export default function Profile() {
  const { currentUser, loading } = useCurrentUser();
  const { setUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    district: "",
    upazila: "",
    bloodGroup: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        image: currentUser.image || "",
        district: currentUser.district || "",
        upazila: currentUser.upazila || "",
        bloodGroup: currentUser.bloodGroup || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const res = await axiosSecure.patch(
        `/update-user/${currentUser._id}`,
        formData
      );

      await updateProfile(auth.currentUser, {
        displayName: formData.name,
        photoURL: formData.image,
      });

      await auth.currentUser.reload();
      setUser(auth.currentUser);

      if (res.data.modifiedCount > 0) {
        toast.success("Profile updated successfully");
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  if (loading || !currentUser)
    return <Loader label="Loading profile..." full={true} />;

  return (
    <div className="min-h-screen px-4 py-8">
      <PageTitle title={"Profile"} />

      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
          My Profile
        </h2>

        {/* Profile Card with Two Columns */}
        <div className="glass p-8 rounded-2xl shadow-2xl">
          {/* Edit Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                editMode
                  ? "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
                  : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white"
              }`}
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Profile Image and Basic Info */}
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="text-center bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-6">
                <div className="relative inline-block">
                  <img
                    src={formData.image}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl mx-auto mb-4"
                  />
                  <div className="absolute bottom-4 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                  {formData.name}
                </h3>
                <p className="text-sm text-slate-600">{formData.email}</p>
              </div>

              {/* Quick Stats */}
              <div className="border-2 border-rose-200 rounded-2xl p-6 bg-white shadow-lg">
                <h4 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-4">
                  Profile Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                    <span className="font-semibold text-slate-700">
                      Blood Group:
                    </span>
                    <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full font-bold">
                      {formData.bloodGroup || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">
                      Location:
                    </span>
                    <span className="text-slate-600">
                      {formData.upazila && formData.district
                        ? `${formData.upazila}, ${formData.district}`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">
                      Status:
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold capitalize">
                      {currentUser.status || "Active"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">Role:</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold capitalize">
                      {currentUser.role || "User"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Edit Form */}
            {/* Right Column - Edit Form */}
            <div className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!editMode}
                    className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 bg-slate-100 text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    readOnly={!editMode}
                    className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    placeholder="Enter image URL"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      District
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                      placeholder="District"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      Upazila
                    </label>
                    <input
                      type="text"
                      name="upazila"
                      value={formData.upazila}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                      placeholder="Upazila"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full border-2 border-rose-200 rounded-lg px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
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

                {/* Submit Button */}
                {editMode && (
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 font-bold mt-6"
                  >
                    💾 Save Changes
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
