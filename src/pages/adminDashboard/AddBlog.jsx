// src/pages/dashboard/AddBlog.jsx
import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    content: "",
  });
  const editor = useRef(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic field validation
    if (!formData.title || !formData.thumbnail || !formData.content) {
      return toast.error("All fields are required");
    }

    try {
      const blogData = {
        ...formData,
        status: "draft", // always store as draft by default
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/add-blog", blogData);

      if (res.data.insertedId || res.data.acknowledged) {
        toast.success("Blog created successfully as draft");
        navigate("/dashboard/content-management");
      }
    } catch (err) {
      toast.error("Failed to create blog");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Add New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title input */}
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input input-bordered w-full"
          required
        />

        {/* Image URL input */}
        <input
          type="text"
          name="thumbnail"
          placeholder="Thumbnail Image URL"
          value={formData.thumbnail}
          onChange={(e) =>
            setFormData({ ...formData, thumbnail: e.target.value })
          }
          className="input input-bordered w-full"
          required
        />

        {/* Preview thumbnail if provided */}
        {formData.thumbnail && (
          <img
            src={formData.thumbnail}
            alt="Thumbnail"
            className="w-32 h-auto mt-2 border"
          />
        )}

        {/* Rich text editor for blog content */}
        <JoditEditor
          ref={editor}
          value={formData.content}
          onChange={(newContent) =>
            setFormData({ ...formData, content: newContent })
          }
        />

        {/* Submit button */}
        <button
          type="submit"
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-rose-700"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
