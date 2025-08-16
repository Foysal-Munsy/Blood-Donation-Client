import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import PageTitle from "../components/PageTitle";

export default function BlogDetails() {
  const axiosSecure = useAxiosSecure();
  const { ID } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get(`/blog-details/${ID}`).then((res) => {
      setDetails(res.data);
      setLoading(false);
    });
  }, [ID]);

  if (loading || !details)
    return <p className="text-center mt-10 font-semibold">Loading...</p>;

  const { title, thumbnail, content, status, createdAt } = details;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto p-4 mt-10">
      <PageTitle title={"Blog Details"} />
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-64 object-cover rounded-xl shadow-md mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="text-sm text-gray-500 mb-4 flex justify-between">
        <span>Status: {status}</span>
        <span>{formattedDate}</span>
      </div>
      <div
        className="prose prose-lg max-w-full"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
