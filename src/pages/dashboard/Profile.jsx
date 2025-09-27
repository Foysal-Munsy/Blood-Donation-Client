import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useCurrentUser from "../../hooks/useCurrentUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { getAuth, updateProfile } from "firebase/auth";
import PageTitle from "../../components/PageTitle";

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
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <p className="text-center">Loading profile...</p>
      </div>
    );

  return (
    <div className=" min-h-screen">
      <PageTitle title={"Profile"} />

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Your Profile</h2>

        {/* Profile Card with Two Columns */}
        <div className="bg-cardBg border-border border rounded-lg p-8 shadow-sm">
          {/* Edit Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                editMode
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : "bg-cta text-btn-text hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Profile Image and Basic Info */}
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="text-center">
                <img
                  src={formData.image}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-2 border-border shadow-md mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-highlighted">
                  {formData.name}
                </h3>
                <p className="text-sm opacity-75">{formData.email}</p>
              </div>

              {/* Quick Stats */}
              <div className=" border border-border rounded-lg p-4">
                <h4 className="font-semibold text-highlighted mb-3">
                  Profile Details
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Blood Group:</span>{" "}
                    {formData.bloodGroup || "Not set"}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {formData.upazila && formData.district
                      ? `${formData.upazila}, ${formData.district}`
                      : "Not set"}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {currentUser.status || "Active"}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span>{" "}
                    {currentUser.role || "User"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Edit Form */}
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!editMode}
                    className="w-full border-border border rounded-lg px-4 py-3  focus:ring-2 focus:ring-highlighted focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full border-border border rounded-lg px-4 py-3  cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    readOnly={!editMode}
                    className="w-full border-border border rounded-lg px-4 py-3  focus:ring-2 focus:ring-highlighted focus:border-transparent"
                    placeholder="Enter image URL"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      District
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className="w-full border-border border rounded-lg px-4 py-3  focus:ring-2 focus:ring-highlighted focus:border-transparent"
                      placeholder="District"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Upazila
                    </label>
                    <input
                      type="text"
                      name="upazila"
                      value={formData.upazila}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className="w-full border-border border rounded-lg px-4 py-3  focus:ring-2 focus:ring-highlighted focus:border-transparent"
                      placeholder="Upazila"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full border-border border rounded-lg px-4 py-3  focus:ring-2 focus:ring-highlighted focus:border-transparent"
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
                    className="w-full bg-cta text-btn-text py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold mt-4"
                  >
                    Save Changes
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
