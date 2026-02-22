import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <h2 className="text-xl font-bold mb-6">
        Student Support
      </h2>

      <nav className="space-y-4">
  {[
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
    { label: "Requests", path: "/requests" },
  ].map((item) => (
    <div
      key={item.label}
      onClick={() => navigate(item.path)}
      className="px-2 py-1 rounded-md
                 transition-all duration-200
                 hover:bg-gray-700 hover:translate-x-2
                 cursor-pointer"
    >
      {item.label}
    </div>
  ))}

  <div
    onClick={() => navigate("/")}
    className="px-2 py-1 rounded-md
               transition-all duration-200
               hover:bg-red-600 hover:translate-x-2
               cursor-pointer"
  >
    Logout
  </div>
</nav>

    </div>
  );
}

export default Sidebar;
