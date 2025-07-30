import React, { useEffect, useState } from "react";
import { Link } from "react-router";

import useAxiosPublic from "../hooks/axiosPublic";

export default function Blog() {
  const axiosPublic = useAxiosPublic();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosPublic
      .get("/get-blogs-public")
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blogs:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-10">Loading blogs...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">
          No published blogs found.
        </p>
      ) : (
        blogs.map((blog) => (
          <div
            key={blog._id}
            className="rounded-xl shadow-lg border hover:shadow-xl transition duration-300 bg-white overflow-hidden"
          >
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {blog.title}
              </h3>
              <div
                className="text-sm text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              <Link
                to={`/blog/${blog._id}`}
                className="inline-block mt-3 text-blue-600 hover:underline text-sm font-medium"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
