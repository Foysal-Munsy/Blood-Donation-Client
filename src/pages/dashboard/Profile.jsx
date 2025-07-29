import { useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useCurrentUser from "../../hooks/useCurrentUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function Profile() {
  const { currentUser, loading } = useCurrentUser();
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
    try {
      const res = await axiosSecure.patch(
        `/update-user/${currentUser._id}`,
        formData
      );
      if (res.data.modifiedCount > 0) {
        toast.success("Profile updated successfully");
        setEditMode(false);
      }
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    }
  };

  if (loading || !currentUser)
    return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>

      <div className="flex justify-center mb-6">
        <img
          src={formData.image}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />
      </div>

      <div className="flex justify-end mb-2">
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          readOnly={!editMode}
          className="input w-full"
          placeholder="Name"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
          className="input w-full bg-gray-100"
        />

        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          readOnly={!editMode}
          className="input w-full"
          placeholder="Image URL"
        />

        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleChange}
          readOnly={!editMode}
          className="input w-full"
          placeholder="District"
        />

        <input
          type="text"
          name="upazila"
          value={formData.upazila}
          onChange={handleChange}
          readOnly={!editMode}
          className="input w-full"
          placeholder="Upazila"
        />

        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          disabled={!editMode}
          className="input w-full"
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

        {editMode && (
          <button
            type="submit"
            className="bg-green-500 text-white w-full py-2 rounded"
          >
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
}
