import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosPublic from "../hooks/axiosPublic";
import Title from "./Title";
import Loader from "./Loader";

export default function PendingRequests() {
  const axiosPublic = useAxiosPublic();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    axiosPublic
      .get("/all-donation-requests-public")
      .then((res) => {
        if (!isMounted) return;
        const data = Array.isArray(res.data) ? res.data : [];
        const pendingOnly = data.filter(
          (d) => String(d.donationStatus).toLowerCase() === "pending"
        );
        setItems(pendingOnly.slice(0, 6));
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Failed to load pending requests.");
      })
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-3">
      <Title>Urgent Pending Requests</Title>
      <p className="text-text opacity-80">
        These patients are waiting for your help.
      </p>

      {loading ? (
        <Loader label="Loading requests..." />
      ) : error ? (
        <div className="text-center text-highlighted">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center opacity-70 text-text">
          No pending requests right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <article
              key={item._id}
              className="border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 bg-cardBg"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-highlighted">
                  {item.recipientName}
                </h3>
                <span className="px-2 py-1 text-xs rounded bg-highlighted text-btn-text font-medium">
                  {item.bloodGroup}
                </span>
              </div>
              <div className="text-sm text-text space-y-1">
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {item.recipientDistrict}, {item.recipientUpazila}
                </p>
                <p>
                  <span className="font-medium">When:</span> {item.donationDate}{" "}
                  at {item.donationTime}
                </p>
                <p className="capitalize">
                  <span className="font-medium">Status:</span>{" "}
                  {item.donationStatus}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  to={`/details/${item._id}`}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-cta text-btn-text text-sm font-medium hover:shadow-md transition"
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          to="/request"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-border text-highlighted dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700 font-medium"
        >
          Browse all requests
        </Link>
      </div>
    </section>
  );
}
