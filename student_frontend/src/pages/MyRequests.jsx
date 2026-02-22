import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/requests/")
      .then((res) => res.json())
      .then((data) => {
        // 🔥 newest requests on TOP
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.created_at || 0) -
            new Date(a.created_at || 0)
        );

        setRequests(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const statusColor = (status) => {
    if (status === "Approved") return "bg-green-600";
    if (status === "Rejected") return "bg-red-600";
    return "bg-yellow-500";
  };

  // format date + time
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";

    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-8">
        📄 My Requests
      </h1>

      {loading ? (
        // 🔥 centered attractive spinner
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-[#2d3748] p-6 rounded-xl shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {req.title}
                </h2>

                <p className="text-gray-300 mt-1">
                  Category: {req.category}
                </p>

                <p className="text-gray-400 text-sm mt-1">
                  Created on: {formatDateTime(req.created_at)}
                </p>
              </div>

              <span
                className={`px-5 py-2 rounded-full text-white font-semibold ${statusColor(
                  req.status
                )}`}
              >
                {req.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyRequests;
