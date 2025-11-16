import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { Link } from "react-router";
import useAxiosPublic from "../hooks/axiosPublic";
import PageTitle from "../components/PageTitle";

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

  if (loading) return <Loader label="Loading blogs..." full={true} />;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 ">
      <PageTitle title={"Blog"} />

      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-text px-4">
          Blood Donation Blog
        </h2>
        <p className="text-base sm:text-lg max-w-2xl mx-auto text-text px-4">
          Latest news, tips, and information about blood donation
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-cardBg border-border border rounded-lg mx-4">
          <p className="text-base sm:text-lg text-text">No published blogs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="rounded-xl shadow-lg border-border border hover:shadow-xl transition-all duration-300 bg-cardBg overflow-hidden group hover:transform hover:-translate-y-1 flex flex-col"
            >
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4 sm:p-5 space-y-2 sm:space-y-3 flex-1 flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold text-highlighted dark:text-rose-400 group-hover:text-highlighted/90 line-clamp-2">
                  {blog.title}
                </h3>
                <div
                  className="text-xs sm:text-sm line-clamp-3 text-text flex-1"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                <Link
                  to={`/blog-details/${blog._id}`}
                  className="inline-block mt-auto text-highlighted hover:underline font-medium text-xs sm:text-sm flex items-center gap-1"
                >
                  Read More
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
