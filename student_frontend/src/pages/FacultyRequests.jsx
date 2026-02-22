import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function FacultyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // detect mode
  const isPendingPage = location.pathname.includes("pending");
  const pageTitle = isPendingPage
    ? "Pending Requests"
    : "Resolved Requests";

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/requests/");
      const data = await res.json();
      setRequests(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // filter based on page
  const filteredRequests = requests.filter((r) =>
    isPendingPage
      ? r.status === "Pending"
      : r.status !== "Pending"
  );

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const riskColor = (risk) => {
    if (risk === "High") return "bg-red-600";
    if (risk === "Medium") return "bg-orange-500";
    return "bg-green-600";
  };

  const statusColor = (status) => {
    if (status === "Approved") return "bg-green-600";
    if (status === "Rejected") return "bg-red-600";
    return "bg-yellow-500";
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        👨‍🏫 {pageTitle}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : filteredRequests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-[#2d3748] p-5 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h2 className="text-white text-lg font-semibold">
                  {req.title}
                </h2>
                <p className="text-gray-300 text-sm">
                  Student: {req.student_name}
                </p>
                <p className="text-gray-400 text-sm">
                  Category: {req.category}
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-white ${riskColor(
                  req.risk
                )}`}
              >
                {req.risk} Risk
              </span>

              <span
                className={`px-4 py-2 rounded-full text-white ${statusColor(
                  req.status
                )}`}
              >
                {req.status}
              </span>

              {isPendingPage && (
                <div className="flex gap-3">
                  <button
                    onClick={() => updateStatus(req.id, "Approved")}
                    className="px-4 py-2 bg-green-600 rounded-full text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, "Rejected")}
                    className="px-4 py-2 bg-red-600 rounded-full text-white"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default FacultyRequests;
