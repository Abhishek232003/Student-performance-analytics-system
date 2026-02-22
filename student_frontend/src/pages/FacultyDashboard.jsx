import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function FacultyDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-8">
        👨‍🏫 Faculty Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-5">

        {/* Pending Requests */}
        <div
          onClick={() => navigate("/faculty-requests/pending")}
          className="cursor-pointer bg-[#b7791f] p-6 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          <h2 className="text-2xl font-semibold text-white">
            Pending Requests
          </h2>
          <p className="text-white mt-2">
            Review student submissions
          </p>
        </div>

        {/* Resolved Requests */}
        <div
          onClick={() => navigate("/faculty-requests/resolved")}
          className="cursor-pointer bg-[#0f766e] p-6 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          <h2 className="text-2xl font-semibold text-white">
            Resolved Requests
          </h2>
          <p className="text-white mt-2">
            Closed and resolved cases
          </p>
        </div>

        {/* Announcements (ONLY CHANGE) */}
        <div
          onClick={() => navigate("/announcements")}
          className="cursor-pointer bg-indigo-600 p-6 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          <h2 className="text-2xl font-semibold text-white">
            Announcements
          </h2>
          <p className="text-white mt-2">
            Post updates for students
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default FacultyDashboard;
