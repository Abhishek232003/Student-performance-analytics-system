import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    // clear login data
    localStorage.removeItem("user_id");
    localStorage.removeItem("teacher_id");
    localStorage.removeItem("role");

    // redirect to login page
    navigate("/");

  };

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col justify-between">

      {/* Top Section */}
      <div>
        <h2 className="text-xl font-bold p-6">
          Teacher Panel
        </h2>

        <ul className="space-y-4 px-6">

          <li>
            <Link to="/dashboard" className="hover:text-purple-400">
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/requests" className="hover:text-purple-400">
              Requests
            </Link>
          </li>

          <li>
            <Link to="/analysis" className="hover:text-purple-400">
              Analysis
            </Link>
          </li>

          <li>
            <Link to="/announcements" className="hover:text-purple-400">
              Announcements
            </Link>
          </li>

        </ul>
      </div>

      {/* Bottom Section */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 py-2 rounded-full"
        >
          Logout
        </button>
      </div>

    </div>
  );
}