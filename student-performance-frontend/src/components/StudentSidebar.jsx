import { Link, useNavigate } from "react-router-dom";

export default function StudentSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    // clear login data
    localStorage.removeItem("user_id");
    localStorage.removeItem("student_id");
    localStorage.removeItem("role");

    // redirect to login page
    navigate("/");
  };

  return (
    <div className="w-64 bg-[#0c1b3a] text-white min-h-screen flex flex-col justify-between p-6">
      
      <div>
        <h1 className="text-2xl font-bold mb-10">Student Panel</h1>

        <nav className="flex flex-col gap-6 text-lg">

          <Link to="/student-dashboard">Dashboard</Link>

          <Link to="/student-requests">My Requests</Link>

          <Link to="/student-announcements">Announcements</Link>

          <Link to="/student-timetable">Timetable</Link>

          {/* ✅ NEW CALENDAR LINK */}
          <Link to="/calendar">Calendar</Link>

          <Link to="/student-learnings"> </Link>

        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 py-3 rounded-full"
      >
        Logout
      </button>

    </div>
  );
}