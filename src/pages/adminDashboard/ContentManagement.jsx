import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";
import useRole from "../../hooks/useRole";
import Swal from "sweetalert2";
import PageTitle from "../../components/PageTitle";

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

  const handleDeleteBlog = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/delete-blog/${id}`);
          if (res.data.deletedCount > 0) {
            toast.success("Blog deleted successfully");
            setBlogs((prevBlogs) => prevBlogs.filter((b) => b._id !== id));

            Swal.fire("Deleted!", "The blog has been deleted.", "success");
          } else {
            Swal.fire("Oops!", "Failed to delete blog.", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Something went wrong.", "error");
        }
      }
    });
  };

  const filteredBlogs = blogs.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  return (
    <div className="p-6">
      <PageTitle title={"Content Management"} />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-highlighted">Content Management</h1>
        <Link to="/dashboard/content-management/add-blog">
          <button className="bg-cta text-btn-text px-4 py-2 rounded shadow-md transition-all cursor-pointer hover:shadow-lg">
            Add Blog
          </button>
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-xs bg-cardBg border border-border rounded-lg px-4 py-2 text-text"
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div key={blog._id} className="bg-cardBg border border-border rounded-lg shadow p-4">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="h-40 w-full object-cover rounded mb-3"
            />
            <h2 className="text-lg font-semibold mb-2 text-highlighted">{blog.title}</h2>
            <p className="text-sm opacity-80 mb-2">
              Status:{" "}
              <span
                className={`font-medium ${
                  blog.status === "published"
                    ? "text-highlighted"
                    : "opacity-75"
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
                    className="bg-cta text-btn-text px-3 py-1 rounded text-sm hover:shadow-md"
                  >
                    Publish
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(blog._id, "draft")}
                    className="bg-rose-200 text-highlighted px-3 py-1 rounded text-sm hover:shadow-md"
                  >
                    Unpublish
                  </button>
                )}

                {/* Delete button (no logic yet) */}
                <button
                  onClick={() => handleDeleteBlog(blog._id)}
                  className="bg-cta text-btn-text px-3 py-1 rounded text-sm hover:shadow-md"
                >
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
