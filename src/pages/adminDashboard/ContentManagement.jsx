import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";
import useRole from "../../hooks/useRole";

const ContentManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  user.role = role;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosSecure.get("/get-blogs");
        setBlogs(res.data);
      } catch (err) {
        toast.error("Failed to load blogs");
      }
    };
    fetchBlogs();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosSecure.patch("/update-blog-status", {
        id,
        status: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        toast.success(
          `Blog ${
            newStatus === "published" ? "published" : "unpublished"
          } successfully`
        );

        // Update the status locally
        setBlogs((prevBlogs) =>
          prevBlogs.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
      } else {
        toast.error("No changes made");
      }
    } catch (error) {
      toast.error("Failed to update blog status");
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <Link to="/dashboard/content-management/add-blog">
          <button className="bg-red-600 hover:bg-rose-700 text-white px-4 py-2 rounded shadow-md transition-all cursor-pointer">
            Add Blog
          </button>
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div key={blog._id} className="bg-white rounded-lg shadow p-4">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="h-40 w-full object-cover rounded mb-3"
            />
            <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              Status:{" "}
              <span
                className={`font-medium ${
                  blog.status === "published"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {blog.status}
              </span>
            </p>

            {/* Action Buttons for Admin */}
            {user?.role === "admin" && (
              <div className="flex flex-wrap gap-2 mt-3">
                {blog.status === "draft" ? (
                  <button
                    onClick={() => handleStatusChange(blog._id, "published")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Publish
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(blog._id, "draft")}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Unpublish
                  </button>
                )}

                {/* Delete button (no logic yet) */}
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManagement;
