import React from "react";
import { Link } from "react-router";

const ContentManagement = () => {
  return (
    <div className="p-6">
      {/* Header section with title and Add Blog button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>

        {/* Add Blog Button */}
        <Link to="/dashboard/content-management/add-blog">
          <button className="bg-red-600 hover:bg-rose-700 text-white px-4 py-2 rounded shadow-md transition-all cursor-pointer">
            Add Blog
          </button>
        </Link>
      </div>

      {/* You can add blog list or content table here later */}
      <div className="text-gray-500 italic">
        No blog content available. Add a new blog to get started.
      </div>
    </div>
  );
};

export default ContentManagement;
